import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const mapHelpRequest = (item) => ({
  ...item,
  _id: item.id,
  createdBy: item.created_by,
  assignedVolunteers: item.assigned_volunteers || [],
  peopleAffected: item.people_affected,
  createdAt: item.created_at,
});

export const getHelpRequests = async (req, res) => {
  let query = supabase.from('help_requests').select('*').order('created_at', { ascending: false });
  if (req.query.status) query = query.eq('status', req.query.status);
  if (req.query.urgency) query = query.eq('urgency', req.query.urgency);
  const { data = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });
  res.json(data.map(mapHelpRequest));
};

export const createHelpRequest = async (req, res) => {
  const { title, description, location, urgency, coordinates, peopleAffected } = req.body;

  if (!title || !location) {
    return res.status(400).json({ message: 'title and location are required' });
  }

  const { data: request, error: requestError } = await supabase
    .from('help_requests')
    .insert({
      title,
      description: description || '',
      location,
      urgency: urgency || 'medium',
      people_affected: Number(peopleAffected) > 0 ? Number(peopleAffected) : 1,
      created_by: req.user._id,
      coordinates: coordinates || null,
      status: 'open',
      assigned_volunteers: [],
    })
    .select('*')
    .single();
  if (requestError) return res.status(400).json({ message: requestError.message });

  const { data: admins = [] } = await supabase.from('users').select('id').eq('role', 'admin');
  if (admins.length) {
    await supabase.from('notifications').insert(
      admins.map((admin) => ({
        user_id: admin.id,
        message: `Help request created: ${request.title}`,
        type: 'alert',
      }))
    );
  }

  const mapped = mapHelpRequest(request);
  emitRealtimeEvent('help-request:new', mapped);
  res.status(201).json(mapped);
};

export const assignHelpRequestVolunteers = async (req, res) => {
  const { volunteerIds } = req.body;
  if (!Array.isArray(volunteerIds)) {
    return res.status(400).json({ message: 'volunteerIds must be an array' });
  }

  const { data: request, error: requestError } = await supabase
    .from('help_requests')
    .select('*')
    .eq('id', req.params.id)
    .maybeSingle();
  if (requestError) return res.status(400).json({ message: requestError.message });
  if (!request) return res.status(404).json({ message: 'Help request not found' });

  const { data: volunteers = [], error: volunteersError } = await supabase
    .from('users')
    .select('id')
    .in('id', volunteerIds)
    .eq('role', 'volunteer');
  if (volunteersError) return res.status(400).json({ message: volunteersError.message });

  const validIds = volunteers.map((volunteer) => volunteer.id);
  const merged = new Set([...(request.assigned_volunteers || []), ...validIds]);

  const { data: updatedRequest, error: updateError } = await supabase
    .from('help_requests')
    .update({ assigned_volunteers: [...merged], status: 'in-progress' })
    .eq('id', req.params.id)
    .select('*')
    .single();
  if (updateError) return res.status(400).json({ message: updateError.message });

  if (validIds.length) {
    await supabase.from('notifications').insert(
      validIds.map((id) => ({
        user_id: id,
        message: `You were assigned to help request: ${updatedRequest.title}`,
        type: 'info',
      }))
    );
  }

  emitRealtimeEvent('help-request:assigned', {
    helpRequestId: updatedRequest.id,
    assignedVolunteers: updatedRequest.assigned_volunteers || [],
  });

  res.json(mapHelpRequest(updatedRequest));
};

export const updateHelpRequestStatus = async (req, res) => {
  const { status } = req.body;
  if (!['open', 'in-progress', 'resolved', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const { data: request, error } = await supabase
    .from('help_requests')
    .update({ status })
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!request) return res.status(404).json({ message: 'Help request not found' });

  const mapped = mapHelpRequest(request);
  emitRealtimeEvent('help-request:updated', mapped);
  res.json(mapped);
};
