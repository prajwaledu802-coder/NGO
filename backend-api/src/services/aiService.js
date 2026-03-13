import { OpenAI } from 'openai';
import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { User } from '../models/User.js';

const hasLlm = Boolean(process.env.OPENAI_API_KEY);

const llmClient = hasLlm
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

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
  const volunteers = await User.find({
    role: 'volunteer',
    status: 'approved',
  }).select('name email skills location status dutyStatus availability impactScore');

  const ranked = volunteers
    .map((volunteer) => ({
      volunteer,
      recommendationScore: scoreVolunteer(volunteer, eventDetails),
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 5)
    .map(({ volunteer, recommendationScore }) => ({
      id: volunteer._id,
      name: volunteer.name,
      location: volunteer.location,
      skills: volunteer.skills,
      availability: volunteer.availability,
      status: volunteer.status,
      dutyStatus: volunteer.dutyStatus,
      recommendationScore,
    }));

  return ranked;
};

export const predictResources = async () => {
  const events = await Event.find().select('resourcesRequired');
  const resourceMap = new Map();

  events.forEach((event) => {
    (event.resourcesRequired || []).forEach((item) => {
      const current = resourceMap.get(item.resourceName) || { total: 0, events: 0 };
      resourceMap.set(item.resourceName, {
        total: current.total + item.quantity,
        events: current.events + 1,
      });
    });
  });

  const inventory = await Resource.find().select('resourceName quantity status');

  return inventory.map((resource) => {
    const historical = resourceMap.get(resource.resourceName) || { total: 0, events: 0 };
    const avgDemand = historical.events ? Math.ceil(historical.total / historical.events) : 0;
    const suggestedStock = Math.max(avgDemand * 2, avgDemand + 10);
    const shortage = Math.max(suggestedStock - resource.quantity, 0);

    return {
      resourceName: resource.resourceName,
      currentStock: resource.quantity,
      avgDemandPerEvent: avgDemand,
      suggestedStock,
      projectedShortage: shortage,
      status: resource.status,
    };
  });
};

const createContextSnapshot = async () => {
  const [availableVolunteers, lowStockResources, eventsNeedingVolunteers] = await Promise.all([
    User.find({ role: 'volunteer', status: 'approved', availability: true })
      .select('name status dutyStatus location')
      .limit(20),
    Resource.find({ status: { $in: ['low', 'critical', 'depleted'] } }).select('resourceName quantity status'),
    Event.find({ status: { $in: ['planned', 'active'] } }).select('title assignedVolunteers'),
  ]);

  return {
    availableVolunteers: availableVolunteers.map((v) => ({
      name: v.name,
      status: v.status,
      dutyStatus: v.dutyStatus,
      location: v.location,
    })),
    lowStockResources: lowStockResources.map((r) => ({
      resourceName: r.resourceName,
      quantity: r.quantity,
      status: r.status,
    })),
    eventsNeedingVolunteers: eventsNeedingVolunteers
      .filter((e) => (e.assignedVolunteers?.length || 0) < 5)
      .map((e) => ({
        event: e.title,
        assignedVolunteers: e.assignedVolunteers?.length || 0,
      })),
  };
};

export const answerAiChat = async (message) => {
  const snapshot = await createContextSnapshot();

  if (!llmClient) {
    return buildFallbackChatAnswer(snapshot, message);
  }

  try {
    const completion = await llmClient.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'You are HelpHive AI assistant. Answer using the provided data snapshot only. If data is missing, say so clearly.',
        },
        {
          role: 'system',
          content: `Snapshot: ${JSON.stringify(snapshot)}`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return completion.choices?.[0]?.message?.content || 'No response generated.';
  } catch {
    return buildFallbackChatAnswer(snapshot, message);
  }
};
