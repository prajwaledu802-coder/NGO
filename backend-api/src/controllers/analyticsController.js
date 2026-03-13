import { supabase } from '../config/supabase.js';

export const getVolunteerActivityAnalytics = async (_req, res) => {
  const [{ data: activities = [], error: activityError }, { data: users = [], error: usersError }] = await Promise.all([
    supabase.from('volunteer_activities').select('*'),
    supabase.from('users').select('id,name'),
  ]);
  if (activityError || usersError) {
    return res.status(400).json({ message: activityError?.message || usersError?.message });
  }

  const userMap = new Map(users.map((user) => [user.id, user]));
  const aggregate = new Map();

  activities.forEach((activity) => {
    const key = activity.volunteer_id;
    const current = aggregate.get(key) || {
      volunteerId: key,
      hoursContributed: 0,
      impactScore: 0,
      eventsJoined: 0,
      lastActivityAt: null,
    };
    current.hoursContributed += activity.hours_contributed || 0;
    current.impactScore += activity.impact_score || 0;
    current.eventsJoined += 1;
    const ts = activity.timestamp || activity.created_at;
    if (!current.lastActivityAt || new Date(ts) > new Date(current.lastActivityAt)) current.lastActivityAt = ts;
    aggregate.set(key, current);
  });

  const result = [...aggregate.values()]
    .map((item) => ({
      ...item,
      volunteerName: userMap.get(item.volunteerId)?.name || 'Unknown',
    }))
    .sort((a, b) => b.impactScore - a.impactScore);

  res.json(result);
};

export const getResourceUsageAnalytics = async (_req, res) => {
  const [{ data: events = [], error: eventsError }, { data: resources = [], error: resourcesError }] = await Promise.all([
    supabase.from('events').select('resources_required'),
    supabase.from('resources').select('resource_name,quantity,status'),
  ]);
  if (eventsError || resourcesError) {
    return res.status(400).json({ message: eventsError?.message || resourcesError?.message });
  }

  const usageByResource = new Map();
  events.forEach((event) => {
    (event.resources_required || []).forEach((resource) => {
      const key = resource.resourceName;
      const current = usageByResource.get(key) || { totalRequired: 0, eventsCount: 0 };
      current.totalRequired += resource.quantity || 0;
      current.eventsCount += 1;
      usageByResource.set(key, current);
    });
  });

  const merged = [...usageByResource.entries()]
    .map(([resourceName, value]) => {
      const stock = resources.find((resource) => (resource.resource_name || '') === resourceName);
      return {
        resourceName,
        totalRequired: value.totalRequired,
        avgRequiredPerEvent: value.eventsCount ? value.totalRequired / value.eventsCount : 0,
        eventsCount: value.eventsCount,
        currentStock: stock?.quantity ?? 0,
        currentStatus: stock?.status ?? 'unknown',
      };
    })
    .sort((a, b) => b.totalRequired - a.totalRequired);

  res.json(merged);
};

export const getEventParticipationAnalytics = async (_req, res) => {
  const { data: events = [], error } = await supabase
    .from('events')
    .select('id,title,status,location,date,assigned_volunteers,resources_required')
    .order('date', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });

  const normalizedEvents = events.map((event) => ({
    title: event.title,
    status: event.status,
    location: event.location,
    date: event.date,
    assignedCount: (event.assigned_volunteers || []).length,
    requiredResourcesCount: (event.resources_required || []).length,
  }));

  const statusCount = new Map();
  events.forEach((event) => {
    statusCount.set(event.status, (statusCount.get(event.status) || 0) + 1);
  });

  const statusSummary = [...statusCount.entries()].map(([status, count]) => ({ _id: status, count }));

  res.json({
    events: normalizedEvents,
    statusSummary,
  });
};
