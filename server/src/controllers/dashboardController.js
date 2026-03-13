import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { User } from '../models/User.js';

export const getDashboardOverview = async (_req, res) => {
  const [volunteers, events, resources] = await Promise.all([
    User.find({ role: 'volunteer' }),
    Event.find(),
    Resource.find(),
  ]);

  const totalHours = volunteers.reduce((sum, v) => sum + (v.hoursContributed || 0), 0);
  const availableResources = resources.filter((r) => r.status === 'available').length;

  const activitySeries = [
    { name: 'Mon', volunteers: Math.max(1, Math.round(volunteers.length * 0.2)) },
    { name: 'Tue', volunteers: Math.max(1, Math.round(volunteers.length * 0.35)) },
    { name: 'Wed', volunteers: Math.max(1, Math.round(volunteers.length * 0.45)) },
    { name: 'Thu', volunteers: Math.max(1, Math.round(volunteers.length * 0.55)) },
    { name: 'Fri', volunteers: Math.max(1, Math.round(volunteers.length * 0.7)) },
    { name: 'Sat', volunteers: Math.max(1, Math.round(volunteers.length * 0.85)) },
    { name: 'Sun', volunteers: Math.max(1, Math.round(volunteers.length * 0.6)) },
  ];

  const resourceSeries = resources.map((r) => ({ name: r.resourceName, quantity: r.quantity }));
  const eventSeries = events
    .slice(-7)
    .map((event) => ({
      name: event.title,
      participants: Array.isArray(event.assignedVolunteers) ? event.assignedVolunteers.length : 0,
      target: Math.max(1, Array.isArray(event.assignedVolunteers) ? event.assignedVolunteers.length + 2 : 2),
    }));

  res.json({
    metrics: {
      totalVolunteers: volunteers.length,
      activeEvents: events.filter((event) => event.status === 'active').length,
      availableResources,
      volunteerHours: totalHours,
    },
    activitySeries,
    resourceSeries,
    eventSeries,
    recentEvents: events.slice(-5).reverse(),
    leaderboard: [...volunteers]
      .sort((a, b) => (b.impactScore || 0) - (a.impactScore || 0))
      .slice(0, 10),
  });
};
