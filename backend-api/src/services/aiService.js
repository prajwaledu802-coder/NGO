import { OpenAI } from 'openai';
import { supabase } from '../config/supabase.js';

const hasLlm = Boolean(process.env.OPENAI_API_KEY);
const llmClient = hasLlm ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const normalizeText = (value) => (value || '').toLowerCase();

const buildFallbackChatAnswer = (snapshot, message) => {
  const lower = normalizeText(message);
  if (lower.includes('available') && lower.includes('volunteer')) {
    return `Available volunteers: ${snapshot.availableVolunteers.map((v) => v.name).join(', ') || 'none found'}.`;
  }
  if (lower.includes('resource') && (lower.includes('low') || lower.includes('stock'))) {
    return `Low-stock resources: ${snapshot.lowStockResources
      .map((r) => `${r.resourceName} (${r.quantity})`)
      .join(', ') || 'none currently low'}.`;
  }
  if (lower.includes('event') && lower.includes('need')) {
    return `Events needing more volunteers: ${snapshot.eventsNeedingVolunteers
      .map((e) => `${e.event} (${e.assignedVolunteers} assigned)`)
      .join(', ') || 'none at the moment'}.`;
  }
  return 'AI assistant is available with core recommendations. Ask about available volunteers, low-stock resources, or events needing more volunteers.';
};

const scoreVolunteer = (volunteer, eventDetails) => {
  const requiredSkills = (eventDetails?.requiredSkills || []).map((s) => s.toLowerCase());
  const volunteerSkills = (volunteer.skills || []).map((s) => s.toLowerCase());
  const skillMatches = requiredSkills.filter((skill) => volunteerSkills.includes(skill)).length;
  const skillsScore = requiredSkills.length ? (skillMatches / requiredSkills.length) * 50 : 20;
  const volunteerLoc = normalizeText(volunteer.location);
  const eventLoc = normalizeText(eventDetails?.location);
  const locationScore = volunteerLoc && eventLoc && volunteerLoc.includes(eventLoc) ? 30 : 10;
  const availabilityScore = volunteer.availability && volunteer.status !== 'inactive' ? 20 : 0;
  return Math.round(skillsScore + locationScore + availabilityScore);
};

export const recommendVolunteers = async (eventDetails) => {
  const { data: volunteers = [] } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'volunteer')
    .eq('status', 'approved');

  return volunteers
    .map((volunteer) => ({
      volunteer,
      recommendationScore: scoreVolunteer(volunteer, eventDetails),
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5)
    .map(({ volunteer, recommendationScore }) => ({
      id: volunteer.id,
      name: volunteer.name,
      location: volunteer.location,
      skills: volunteer.skills,
      availability: volunteer.availability,
      status: volunteer.status,
      dutyStatus: volunteer.duty_status || volunteer.dutyStatus,
      recommendationScore,
    }));
};

export const predictResources = async () => {
  const [{ data: events = [] }, { data: inventory = [] }] = await Promise.all([
    supabase.from('events').select('resources_required'),
    supabase.from('resources').select('resource_name,quantity,status'),
  ]);

  const resourceMap = new Map();
  events.forEach((event) => {
    (event.resources_required || []).forEach((item) => {
      const current = resourceMap.get(item.resourceName) || { total: 0, events: 0 };
      resourceMap.set(item.resourceName, {
        total: current.total + item.quantity,
        events: current.events + 1,
      });
    });
  });

  return inventory.map((resource) => {
    const resourceName = resource.resource_name;
    const historical = resourceMap.get(resourceName) || { total: 0, events: 0 };
    const avgDemand = historical.events ? Math.ceil(historical.total / historical.events) : 0;
    const suggestedStock = Math.max(avgDemand * 2, avgDemand + 10);
    return {
      resourceName,
      currentStock: resource.quantity,
      avgDemandPerEvent: avgDemand,
      suggestedStock,
      projectedShortage: Math.max(suggestedStock - resource.quantity, 0),
      status: resource.status,
    };
  });
};

const createContextSnapshot = async () => {
  const [availableVolunteersRes, lowStockResourcesRes, eventsRes] = await Promise.all([
    supabase.from('users').select('name,status,duty_status,location').eq('role', 'volunteer').eq('status', 'approved').eq('availability', true).limit(20),
    supabase.from('resources').select('resource_name,quantity,status').in('status', ['low', 'critical', 'depleted']),
    supabase.from('events').select('title,assigned_volunteers').in('status', ['planned', 'active']),
  ]);

  const availableVolunteers = availableVolunteersRes.data || [];
  const lowStockResources = lowStockResourcesRes.data || [];
  const eventsNeedingVolunteers = (eventsRes.data || []).filter((event) => (event.assigned_volunteers?.length || 0) < 5);

  return {
    availableVolunteers: availableVolunteers.map((v) => ({
      name: v.name,
      status: v.status,
      dutyStatus: v.duty_status,
      location: v.location,
    })),
    lowStockResources: lowStockResources.map((r) => ({
      resourceName: r.resource_name,
      quantity: r.quantity,
      status: r.status,
    })),
    eventsNeedingVolunteers: eventsNeedingVolunteers.map((e) => ({
      event: e.title,
      assignedVolunteers: e.assigned_volunteers?.length || 0,
    })),
  };
};

export const answerAiChat = async (message) => {
  const snapshot = await createContextSnapshot();
  if (!llmClient) return buildFallbackChatAnswer(snapshot, message);

  try {
    const completion = await llmClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content: 'You are HelpHive AI assistant. Answer using the provided data snapshot only. If data is missing, say so clearly.',
        },
        { role: 'system', content: `Snapshot: ${JSON.stringify(snapshot)}` },
        { role: 'user', content: message },
      ],
    });
    return completion.choices?.[0]?.message?.content || 'No response generated.';
  } catch {
    return buildFallbackChatAnswer(snapshot, message);
  }
};
