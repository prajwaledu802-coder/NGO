import { supabase } from '../config/supabase.js';

export const getVolunteerDashboard = async (req, res) => {
  const volunteerId = req.user._id;

  const [profileRes, eventsRes, notificationsRes, activityRes, tasksRes, disastersRes, leaderboardRes] = await Promise.all([
    supabase.from('users').select('*').eq('id', volunteerId).maybeSingle(),
    supabase.from('events').select('*').order('date', { ascending: true }),
    supabase.from('notifications').select('*').eq('user_id', volunteerId).order('timestamp', { ascending: false }).limit(20),
    supabase.from('volunteer_activities').select('*').eq('volunteer_id', volunteerId).order('timestamp', { ascending: false }).limit(40),
    supabase.from('tasks').select('*').eq('assigned_volunteer', volunteerId).order('created_at', { ascending: false }).limit(20),
    supabase.from('disasters').select('*').eq('status', 'active').order('detected_at', { ascending: false }).limit(20),
    supabase
      .from('users')
      .select('id,name,hours_contributed,impact_score')
      .eq('role', 'volunteer')
      .eq('status', 'approved')
      .order('impact_score', { ascending: false })
      .order('hours_contributed', { ascending: false })
      .limit(10),
  ]);

  const profile = profileRes.data;
  const events = eventsRes.data || [];
  const notifications = notificationsRes.data || [];
  const activity = activityRes.data || [];
  const tasks = tasksRes.data || [];
  const disasters = disastersRes.data || [];
  const leaderboard = leaderboardRes.data || [];

  const joinedEvents = events.filter((event) =>
    (event.assigned_volunteers || []).some((id) => String(id) === String(volunteerId))
  );
  const nearbyEvents = events.filter(
    (event) => !(event.assigned_volunteers || []).some((id) => String(id) === String(volunteerId))
  );
  const upcomingEvents = joinedEvents.filter((event) => new Date(event.date) >= new Date());

  res.json({
    profile: profile
      ? {
          ...profile,
          _id: profile.id,
          dutyStatus: profile.duty_status,
          impactScore: profile.impact_score ?? 0,
          hoursContributed: profile.hours_contributed ?? 0,
          eventsJoined: profile.events_joined ?? 0,
        }
      : null,
    metrics: {
      eventsJoined: profile?.events_joined || 0,
      volunteerHours: profile?.hours_contributed || 0,
      impactScore: profile?.impact_score || 0,
      upcomingEvents: upcomingEvents.length,
    },
    joinedEvents: joinedEvents.map((event) => ({ ...event, _id: event.id, assignedVolunteers: event.assigned_volunteers || [] })),
    nearbyEvents: nearbyEvents.map((event) => ({ ...event, _id: event.id, assignedVolunteers: event.assigned_volunteers || [] })),
    notifications: notifications.map((item) => ({ ...item, _id: item.id, userId: item.user_id, readStatus: item.read_status })),
    activity: activity.map((item) => ({
      ...item,
      _id: item.id,
      volunteerId: item.volunteer_id,
      eventId: item.event_id,
      hoursContributed: item.hours_contributed,
      impactScore: item.impact_score,
    })),
    tasks: tasks.map((item) => ({
      ...item,
      _id: item.id,
      assignedVolunteer: item.assigned_volunteer,
      eventId: item.event_id,
    })),
    disasters: disasters.map((item) => ({ ...item, _id: item.id, detectedAt: item.detected_at })),
    leaderboard: leaderboard.map((volunteer, index) => ({
      rank: index + 1,
      volunteerId: volunteer.id,
      name: volunteer.name,
      hoursWorked: volunteer.hours_contributed || 0,
      impactScore: volunteer.impact_score || 0,
    })),
  });
};
