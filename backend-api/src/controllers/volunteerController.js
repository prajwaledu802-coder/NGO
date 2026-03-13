import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const volunteerProjection =
  'name email phone role status dutyStatus location skills coordinates availability impactScore hoursContributed eventsJoined achievements createdAt';

const buildProfileImage = (volunteer) => {
  const seed = encodeURIComponent(volunteer.email || volunteer.name || String(volunteer._id));
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
};

const mapVolunteer = (volunteer) => ({
  id: volunteer.id || volunteer._id,
  _id: volunteer.id || volunteer._id,
  name: volunteer.name,
  fullName: volunteer.name,
  email: volunteer.email,
  phone: volunteer.phone,
  role: volunteer.role,
  status: volunteer.status,
  dutyStatus: volunteer.duty_status || volunteer.dutyStatus,
  location: volunteer.location,
  skills: volunteer.skills,
  coordinates: volunteer.coordinates,
  availability: volunteer.availability,
  impactScore: volunteer.impact_score ?? volunteer.impactScore ?? 0,
  hoursContributed: volunteer.hours_contributed ?? volunteer.hoursContributed ?? 0,
  hoursWorked: volunteer.hours_contributed ?? volunteer.hoursContributed ?? 0,
  eventsJoined: volunteer.events_joined ?? volunteer.eventsJoined ?? 0,
  profileImage: buildProfileImage(volunteer),
  achievements: volunteer.achievements,
  createdAt: volunteer.created_at || volunteer.createdAt,
});

export const getVolunteers = async (req, res) => {
  const { search, status, availability } = req.query;
  let query = supabase.from('users').select('*').eq('role', 'volunteer').order('created_at', { ascending: false });
  if (status) {
    if (['on-duty', 'off-duty'].includes(status)) {
      query = query.eq('duty_status', status);
    } else {
      query = query.eq('status', status);
    }
  }
  if (availability !== undefined) query = query.eq('availability', availability === 'true');
  const { data: volunteers, error } = await query;
  if (error) return res.status(400).json({ message: error.message });

  const filtered = !search
    ? volunteers
    : (volunteers || []).filter((volunteer) => {
        const term = search.toLowerCase();
        const skills = Array.isArray(volunteer.skills) ? volunteer.skills.join(' ') : '';
        return [volunteer.name, volunteer.location, skills].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(term)
        );
      });

  res.json((filtered || []).map(mapVolunteer));
};

export const createVolunteer = async (req, res) => {
  const { name, fullName, email, password, phone, location, skills, status, coordinates } = req.body;

  if (!(name || fullName) || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const { data: exists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (exists) {
    return res.status(400).json({ message: 'Volunteer email already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const { data: volunteer, error: createError } = await supabase
    .from('users')
    .insert({
      name: name || fullName,
      email,
      phone: phone || '',
      password: passwordHash,
      role: 'volunteer',
      status: status || (req.user?.role === 'admin' ? 'approved' : 'pending'),
      location: location || '',
      skills: Array.isArray(skills) ? skills : [],
      coordinates: coordinates || null,
      duty_status: 'off-duty',
      availability: true,
    })
    .select('*')
    .single();
  if (createError) return res.status(400).json({ message: createError.message });

  if (req.user?.role !== 'admin') {
    const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin');
    if (admins?.length) {
      await supabase.from('notifications').insert(
        admins.map((admin) => ({
          user_id: admin.id,
          message: `New volunteer registration: ${volunteer.name}`,
          type: 'info',
        }))
      );
    }
  }

  emitRealtimeEvent('volunteer:created', mapVolunteer(volunteer));
  res.status(201).json(mapVolunteer(volunteer));
};

export const getVolunteerById = async (req, res) => {
  const { data: volunteer } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .eq('role', 'volunteer')
    .maybeSingle();
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(mapVolunteer(volunteer));
};

export const updateVolunteer = async (req, res) => {
  const { data: volunteer } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .eq('role', 'volunteer')
    .maybeSingle();
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const canSelfEdit = req.user.role === 'volunteer' && String(req.user._id) === String(volunteer.id);
  const isAdmin = req.user.role === 'admin';

  if (!canSelfEdit && !isAdmin) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const mutableFields = isAdmin
    ? [
        'name',
        'phone',
        'location',
        'skills',
        'coordinates',
        'availability',
        'status',
        'hoursContributed',
        'impactScore',
        'eventsJoined',
        'achievements',
      ]
    : ['name', 'phone', 'location', 'skills', 'coordinates', 'availability'];

  const updates = {};
  mutableFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });
  if (updates.dutyStatus !== undefined) {
    updates.duty_status = updates.dutyStatus;
    delete updates.dutyStatus;
  }
  if (updates.hoursContributed !== undefined) {
    updates.hours_contributed = updates.hoursContributed;
    delete updates.hoursContributed;
  }
  if (updates.impactScore !== undefined) {
    updates.impact_score = updates.impactScore;
    delete updates.impactScore;
  }
  if (updates.eventsJoined !== undefined) {
    updates.events_joined = updates.eventsJoined;
    delete updates.eventsJoined;
  }
  if (req.body.fullName) updates.name = req.body.fullName;

  const { data: updated, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();
  if (error) return res.status(400).json({ message: error.message });

  emitRealtimeEvent('volunteer:updated', mapVolunteer(updated || volunteer));
  res.json(mapVolunteer(updated || volunteer));
};

export const deleteVolunteer = async (req, res) => {
  const { data: volunteer } = await supabase
    .from('users')
    .delete()
    .eq('id', req.params.id)
    .eq('role', 'volunteer')
    .select('*')
    .maybeSingle();
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  emitRealtimeEvent('volunteer:deleted', { id: req.params.id });
  res.json({ message: 'Volunteer deleted' });
};

export const approveVolunteer = async (req, res) => {
  const { data: volunteer } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .eq('role', 'volunteer')
    .maybeSingle();
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const action = (req.body.action || 'approve').toLowerCase();
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'action must be approve or reject' });
  }

  const nextStatus = action === 'approve' ? 'approved' : 'rejected';
  const { data: updated } = await supabase
    .from('users')
    .update({ status: nextStatus })
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();

  await supabase.from('notifications').insert({
    user_id: volunteer.id,
    message:
      action === 'approve'
        ? 'You have been approved.'
        : 'Your volunteer registration was rejected. Contact admin for details.',
    type: action === 'approve' ? 'success' : 'warning',
  });

  emitRealtimeEvent(action === 'approve' ? 'volunteer:approved' : 'volunteer:rejected', mapVolunteer(updated || volunteer));
  res.json(mapVolunteer(updated || volunteer));
};

export const updateDutyStatus = async (req, res) => {
  const { data: volunteer } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.params.id)
    .eq('role', 'volunteer')
    .maybeSingle();
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const canSelfEdit = req.user.role === 'volunteer' && String(req.user._id) === String(volunteer.id);
  const isAdmin = req.user.role === 'admin';
  if (!canSelfEdit && !isAdmin) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const dutyStatus = req.body.status || req.body.dutyStatus;
  if (!['on-duty', 'off-duty'].includes(dutyStatus)) {
    return res.status(400).json({ message: 'status must be on-duty or off-duty' });
  }

  const { data: updated } = await supabase
    .from('users')
    .update({ duty_status: dutyStatus, availability: dutyStatus === 'on-duty' })
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();

  emitRealtimeEvent('volunteer:duty-updated', {
    volunteerId: volunteer.id,
    status: dutyStatus,
  });

  res.json(mapVolunteer(updated || volunteer));
};

export const getVolunteerActivity = async (req, res) => {
  const volunteerId = req.params.id;
  const { data: activities, error } = await supabase
    .from('volunteer_activities')
    .select('*')
    .eq('volunteer_id', volunteerId)
    .order('timestamp', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });

  res.json(
    (activities || []).map((activity) => ({
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
