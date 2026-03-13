import { User } from '../models/User.js';

const computeRankScore = (volunteer) => {
  const impact = volunteer.impactScore || 0;
  const events = volunteer.eventsJoined || 0;
  const hours = volunteer.hoursContributed || 0;

  return Number((impact * 0.5 + events * 0.25 + hours * 0.25).toFixed(2));
};

export const getLeaderboard = async (_req, res) => {
  const volunteers = await User.find({ role: 'volunteer' }).select(
    'name email impactScore eventsJoined hoursContributed status location'
  );

  const ranked = volunteers
    .map((volunteer) => ({
      volunteerId: volunteer._id,
      name: volunteer.name,
      email: volunteer.email,
      impactScore: volunteer.impactScore || 0,
      eventsJoined: volunteer.eventsJoined || 0,
      hoursContributed: volunteer.hoursContributed || 0,
      status: volunteer.status,
      location: volunteer.location,
      rankScore: computeRankScore(volunteer),
    }))
    .sort((a, b) => b.rankScore - a.rankScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  res.json(ranked);
};
