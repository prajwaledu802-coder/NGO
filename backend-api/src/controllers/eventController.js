import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const mapEvent = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  title: row.title || row.name,
  name: row.title || row.name,
  assignedVolunteers: row.assigned_volunteers || row.assignedVolunteers || [],
  resourcesRequired: row.resources_required || row.resourcesRequired || [],
  volunteersRequired: row.volunteers_required ?? row.volunteersRequired ?? 0,
  createdBy: row.created_by || row.createdBy || null,
  createdAt: row.created_at || row.createdAt,
  coordinates: row.coordinates || { lat: 28.6139, lng: 77.209 },
});

export const getEvents = async (req, res) => {
  let query = supabase.from('events').select('*').order('date', { ascending: true });
  if (req.query.status) query = query.eq('status', req.query.status);
  const { data, error } = await query;
  if (error) return res.status(400).json({ message: error.message });

  res.json((data || []).map(mapEvent));
};

export const createEvent = async (req, res) => {
  const {
    title,
    name,
    description,
    location,
    date,
    volunteersRequired,
    resourcesRequired,
    assignedVolunteers,
    status,
    coordinates,
  } = req.body;

  if (!(title || name) || !location || !date) {
    return res.status(400).json({ message: 'title, location and date are required' });
  }

  const { data: event, error: createError } = await supabase
    .from('events')
    .insert({
      title: title || name,
      description: description || '',
      location,
      date,
      resources_required: Array.isArray(resourcesRequired) ? resourcesRequired : [],
      volunteers_required: Number(volunteersRequired) || 0,
      assigned_volunteers: Array.isArray(assignedVolunteers) ? assignedVolunteers : [],
      status: status || 'planned',
      created_by: req.user._id,
      coordinates: coordinates || null,
    })
    .select('*')
    .single();
  if (createError) return res.status(400).json({ message: createError.message });

  const { data: volunteers } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'volunteer')
    .eq('status', 'approved');
  if (volunteers?.length) {
    await supabase.from('notifications').insert(
      volunteers.map((volunteer) => ({
        user_id: volunteer.id,
        message: `New Event Available: ${event.title}`,
        type: 'info',
      }))
    );
  }

  const mapped = mapEvent(event);
  emitRealtimeEvent('event:new', mapped);
  res.status(201).json(mapped);
};

export const updateEvent = async (req, res) => {
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.name !== undefined) updates.title = req.body.name;
  if (req.body.description !== undefined) updates.description = req.body.description;
  if (req.body.location !== undefined) updates.location = req.body.location;
  if (req.body.date !== undefined) updates.date = req.body.date;
  if (req.body.volunteersRequired !== undefined) updates.volunteers_required = req.body.volunteersRequired;
  if (req.body.resourcesRequired !== undefined) updates.resources_required = req.body.resourcesRequired;
  if (req.body.assignedVolunteers !== undefined) updates.assigned_volunteers = req.body.assignedVolunteers;
  if (req.body.status !== undefined) updates.status = req.body.status;
  if (req.body.coordinates !== undefined) updates.coordinates = req.body.coordinates;

  const { data: event, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();

  if (error) return res.status(400).json({ message: error.message });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const mapped = mapEvent(event);
  emitRealtimeEvent('event:updated', mapped);
  res.json(mapped);
};

export const deleteEvent = async (req, res) => {
  const { data: event, error } = await supabase.from('events').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  emitRealtimeEvent('event:deleted', { id: req.params.id });
  res.json({ message: 'Event deleted' });
};

export const assignVolunteersToEvent = async (req, res) => {
  const { volunteerIds } = req.body;
  if (!Array.isArray(volunteerIds)) {
    return res.status(400).json({ message: 'volunteerIds must be an array' });
  }

  const { data: event, error: eventError } = await supabase.from('events').select('*').eq('id', req.params.id).maybeSingle();
  if (eventError) return res.status(400).json({ message: eventError.message });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { data: volunteers, error: volunteersError } = await supabase
    .from('users')
    .select('id')
    .in('id', volunteerIds)
    .eq('role', 'volunteer');
  if (volunteersError) return res.status(400).json({ message: volunteersError.message });
  const validIds = (volunteers || []).map((v) => v.id);

  const assigned = event.assigned_volunteers || event.assignedVolunteers || [];
  const merged = new Set([...(assigned || []).map((id) => String(id)), ...validIds]);
  const mergedIds = [...merged];

  const { data: updatedEvent, error: updateError } = await supabase
    .from('events')
    .update({ assigned_volunteers: mergedIds })
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();
  if (updateError) return res.status(400).json({ message: updateError.message });

  await supabase.from('notifications').insert(
    validIds.map((id) => ({
      user_id: id,
      message: `You have been assigned to event: ${event.title}`,
      type: 'info',
    }))
  );

  emitRealtimeEvent('event:assignment-updated', {
    eventId: event.id,
    assignedVolunteers: mergedIds,
  });

  res.json(mapEvent(updatedEvent || event));
};

export const joinEvent = async (req, res) => {
  const { data: event, error: eventError } = await supabase.from('events').select('*').eq('id', req.params.id).maybeSingle();
  if (eventError) return res.status(400).json({ message: eventError.message });
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can join events' });
  }

  const volunteerId = String(req.user._id);
  const assigned = event.assigned_volunteers || event.assignedVolunteers || [];
  const exists = assigned.some((id) => String(id) === volunteerId);
  const nextAssigned = exists ? assigned : [...assigned, volunteerId];
  if (!exists) {
    const { error: updateError } = await supabase
      .from('events')
      .update({ assigned_volunteers: nextAssigned })
      .eq('id', req.params.id);
    if (updateError) return res.status(400).json({ message: updateError.message });
  }

  if (!exists) {
    const { data: currentUser } = await supabase
      .from('users')
      .select('events_joined')
      .eq('id', volunteerId)
      .maybeSingle();
    const current = currentUser?.events_joined ?? 0;
    await supabase
      .from('users')
      .update({ events_joined: current + 1 })
      .eq('id', volunteerId);
  }

  await supabase.from('volunteer_activities').insert({
    volunteer_id: volunteerId,
    event_id: event.id,
    hours_contributed: 0,
    impact_score: 5,
    completion_status: 'joined',
  });

  emitRealtimeEvent('event:volunteer-joined', {
    eventId: event.id,
    volunteerId,
  });

  res.json(mapEvent({ ...event, assigned_volunteers: nextAssigned }));
};
