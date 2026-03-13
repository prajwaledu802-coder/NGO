import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { Volunteer } from '../models/Volunteer.js';

export const getDashboardOverview = async (_req, res) => {
  const [volunteers, events, resources] = await Promise.all([
    Volunteer.find(),
    Event.find(),
    Resource.find(),
  ]);

  const totalHours = volunteers.reduce((sum, v) => sum + (v.hoursContributed || 0), 0);
  const availableResources = resources.filter((r) => r.status === 'Available').length;

  const activitySeries = [
    { name: 'Mon', volunteers: Math.max(1, Math.round(volunteers.length * 0.2)) },
    { name: 'Tue', volunteers: Math.max(1, Math.round(volunteers.length * 0.35)) },
    { name: 'Wed', volunteers: Math.max(1, Math.round(volunteers.length * 0.45)) },
    { name: 'Thu', volunteers: Math.max(1, Math.round(volunteers.length * 0.55)) },
    { name: 'Fri', volunteers: Math.max(1, Math.round(volunteers.length * 0.7)) },
    { name: 'Sat', volunteers: Math.max(1, Math.round(volunteers.length * 0.85)) },
    { name: 'Sun', volunteers: Math.max(1, Math.round(volunteers.length * 0.6)) },
  ];

  const resourceSeries = resources.map((r) => ({ name: r.name, quantity: r.quantity }));

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
