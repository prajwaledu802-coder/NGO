import { Disaster } from '../models/Disaster.js';
import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';

export const getVolunteerDashboard = async (req, res) => {
  const volunteerId = req.user._id;

  const [profile, events, notifications, activity, tasks, disasters, leaderboard] = await Promise.all([
    User.findById(volunteerId).select(
      'name email role status dutyStatus location skills coordinates availability impactScore hoursContributed eventsJoined achievements'
    ),
    Event.find().sort({ date: 1 }),
    Notification.find({ userId: volunteerId }).sort({ timestamp: -1 }).limit(20),
    VolunteerActivity.find({ volunteerId })
      .populate('eventId', 'title location date status')
      .sort({ timestamp: -1 })
      .limit(40),
    Task.find({ assignedVolunteer: volunteerId })
      .populate('eventId', 'title location date status')
      .sort({ createdAt: -1 })
      .limit(20),
    Disaster.find({ status: 'active' }).sort({ detectedAt: -1 }).limit(20),
    User.find({ role: 'volunteer', status: 'approved' })
      .select('name hoursContributed impactScore')
      .sort({ impactScore: -1, hoursContributed: -1 })
      .limit(10),
  ]);

  const joinedEvents = events.filter((event) =>
    (event.assignedVolunteers || []).some((id) => id.toString() === volunteerId.toString())
  );

  const nearbyEvents = events.filter((event) =>
    !(event.assignedVolunteers || []).some((id) => id.toString() === volunteerId.toString())
  );

  const upcomingEvents = joinedEvents.filter((event) => new Date(event.date) >= new Date());

  res.json({
    profile,
    metrics: {
      eventsJoined: profile?.eventsJoined || 0,
      volunteerHours: profile?.hoursContributed || 0,
      impactScore: profile?.impactScore || 0,
      upcomingEvents: upcomingEvents.length,
    },
    joinedEvents,
    nearbyEvents,
    notifications,
    activity,
    tasks,
    disasters,
    leaderboard: leaderboard.map((volunteer, index) => ({
      rank: index + 1,
      volunteerId: volunteer._id,
      name: volunteer.name,
      hoursWorked: volunteer.hoursContributed || 0,
      impactScore: volunteer.impactScore || 0,
    })),
  });
};
