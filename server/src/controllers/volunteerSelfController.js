import { User } from '../models/User.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';

export const getImpact = async (req, res) => {
  const volunteerId = req.user._id;
  const [profile, activities] = await Promise.all([
    User.findById(volunteerId).select('name impactScore hoursContributed eventsJoined'),
    VolunteerActivity.find({ volunteerId }).sort({ timestamp: -1 }),
  ]);

  const score = profile?.impactScore || 0;
  const totalHours = profile?.hoursContributed || 0;

  const leaderboard = await User.find({ role: 'volunteer' })
    .sort({ impactScore: -1 })
    .select('_id')
    .limit(200);
  const rank = leaderboard.findIndex((v) => v._id.toString() === volunteerId.toString()) + 1;

  const progressPercent = Math.min(100, Math.round((score / 1000) * 100));
  const badges = ['Bronze Volunteer', 'Silver Volunteer', 'Gold Volunteer', 'Community Hero'];

  res.json({ impactScore: score, rank: rank || 0, hoursContributed: totalHours, progressPercent, badges, activities: activities.length });
};

export const getCertificate = async (req, res) => {
  const volunteerId = req.user._id;
  const profile = await User.findById(volunteerId).select('name hoursContributed eventsJoined');
  res.json({
    volunteerName: profile?.name || 'Volunteer',
    totalHours: profile?.hoursContributed || 0,
    eventsCompleted: profile?.eventsJoined || 0,
  });
};
