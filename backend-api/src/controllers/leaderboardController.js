import { supabase } from '../config/supabase.js';

const computeRankScore = (volunteer) => {
  const impact = volunteer.impactScore || 0;
  const events = volunteer.eventsJoined || 0;
  const hours = volunteer.hoursContributed || 0;

  return Number((impact * 0.5 + events * 0.25 + hours * 0.25).toFixed(2));
};

export const getLeaderboard = async (_req, res) => {
  const { data: volunteers = [], error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'volunteer');
  if (error) return res.status(400).json({ message: error.message });

  const ranked = volunteers
    .map((volunteer) => ({
      volunteerId: volunteer.id,
      name: volunteer.name,
      email: volunteer.email,
      impactScore: volunteer.impact_score ?? 0,
      eventsJoined: volunteer.events_joined ?? 0,
      hoursContributed: volunteer.hours_contributed ?? 0,
      status: volunteer.status,
      location: volunteer.location,
      rankScore: computeRankScore({
        impactScore: volunteer.impact_score ?? 0,
        eventsJoined: volunteer.events_joined ?? 0,
        hoursContributed: volunteer.hours_contributed ?? 0,
      }),
    }))
    .sort((a, b) => b.rankScore - a.rankScore)
    .map((item, index) => ({ ...item, rank: index + 1 }));

  res.json(ranked);
};
