import { supabase } from '../config/supabase.js';

export const getActivity = async (req, res) => {
  let query = supabase
    .from('volunteer_activities')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(200);
  if (req.user.role !== 'admin') query = query.eq('volunteer_id', req.user._id);
  const { data: activities = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });

  res.json(
    activities.map((activity) => ({
      ...activity,
      _id: activity.id,
      volunteerId: activity.volunteer_id,
      eventId: activity.event_id,
      hoursContributed: activity.hours_contributed,
      impactScore: activity.impact_score,
      completionStatus: activity.completion_status,
    }))
  );
};
