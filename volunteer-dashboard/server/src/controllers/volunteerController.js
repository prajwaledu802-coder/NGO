import { supabase } from '../config/supabase.js';

const mapVolunteer = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  volunteerRole: row.volunteer_role || row.volunteerRole || 'Field Volunteer',
  hoursContributed: row.hours_contributed ?? row.hoursContributed ?? 0,
  impactScore: row.impact_score ?? row.impactScore ?? 0,
  eventsParticipated: row.events_participated ?? row.eventsParticipated ?? 0,
  createdAt: row.created_at || row.createdAt,
});

export const getVolunteers = async (req, res) => {
  const search = req.query.search;
  const { data: volunteers, error } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });

  const filtered = !search
    ? volunteers
    : (volunteers || []).filter((volunteer) =>
        String(volunteer.name || '')
          .toLowerCase()
          .includes(String(search).toLowerCase())
      );

  res.json((filtered || []).map(mapVolunteer));
};

export const createVolunteer = async (req, res) => {
  const { data, error } = await supabase
    .from('volunteers')
    .insert({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || '',
      location: req.body.location || '',
      skills: req.body.skills || [],
      volunteer_role: req.body.volunteerRole || req.body.volunteer_role || 'Field Volunteer',
      hours_contributed: req.body.hoursContributed ?? 0,
      impact_score: req.body.impactScore ?? 0,
      events_participated: req.body.eventsParticipated ?? 0,
      avatar: req.body.avatar || null,
      coordinates: req.body.coordinates || null,
    })
    .select('*')
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(mapVolunteer(data));
};

export const getVolunteerById = async (req, res) => {
  const { data: volunteer, error } = await supabase
    .from('volunteers')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(mapVolunteer(volunteer));
};
