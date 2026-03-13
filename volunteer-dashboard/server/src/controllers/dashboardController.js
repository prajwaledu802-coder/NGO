import { supabase } from '../config/supabase.js';

export const getDashboardOverview = async (_req, res) => {
  const [{ data: volunteers = [] }, { data: events = [] }, { data: resources = [] }] = await Promise.all([
    supabase.from('volunteers').select('*'),
    supabase.from('events').select('*'),
    supabase.from('resources').select('*'),
  ]);

  const totalHours = volunteers.reduce(
    (sum, v) => sum + (v.hours_contributed ?? v.hoursContributed ?? 0),
    0
  );
  const availableResources = resources.filter((r) => (r.status || '').toLowerCase() === 'available').length;

  const activitySeries = [
    { name: 'Mon', volunteers: Math.max(1, Math.round(volunteers.length * 0.2)) },
    { name: 'Tue', volunteers: Math.max(1, Math.round(volunteers.length * 0.35)) },
    { name: 'Wed', volunteers: Math.max(1, Math.round(volunteers.length * 0.45)) },
    { name: 'Thu', volunteers: Math.max(1, Math.round(volunteers.length * 0.55)) },
    { name: 'Fri', volunteers: Math.max(1, Math.round(volunteers.length * 0.7)) },
    { name: 'Sat', volunteers: Math.max(1, Math.round(volunteers.length * 0.85)) },
    { name: 'Sun', volunteers: Math.max(1, Math.round(volunteers.length * 0.6)) },
  ];

  const resourceSeries = resources.map((r) => ({ name: r.name || r.resource_name, quantity: r.quantity }));

  res.json({
    metrics: {
      totalVolunteers: volunteers.length,
      activeEvents: events.length,
      availableResources,
      volunteerHours: totalHours,
    },
    activitySeries,
    resourceSeries,
    recentEvents: events.slice(-5).reverse(),
    leaderboard: [...volunteers]
      .sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
      .slice(0, 10),
  });
};
