import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getLocations = async (req, res) => {
  let query = supabase
    .from('locations')
    .select('*, users!locations_volunteer_id_fkey(id,name,email,status,role,coordinates,location)')
    .order('timestamp', { ascending: false })
    .limit(300);

  if (req.user.role !== 'admin') query = query.eq('volunteer_id', req.user._id);
  if (req.query.volunteerId && req.user.role === 'admin') query = query.eq('volunteer_id', req.query.volunteerId);

  const { data: locations = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });

  res.json(
    locations.map((item) => ({
      ...item,
      _id: item.id,
      volunteerId: item.volunteer_id,
      volunteer: item.users || null,
    }))
  );
};

export const createLocation = async (req, res) => {
  const { lat, lng, accuracy, volunteerId } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ message: 'lat and lng are required' });
  }

  const targetVolunteerId = req.user.role === 'admin' && volunteerId ? volunteerId : req.user._id;

  const { data: volunteer } = await supabase
    .from('users')
    .select('*')
    .eq('id', targetVolunteerId)
    .eq('role', 'volunteer')
    .maybeSingle();
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found for location update' });
  }

  const { data: location, error: createError } = await supabase
    .from('locations')
    .insert({
      volunteer_id: targetVolunteerId,
      lat,
      lng,
      accuracy: accuracy ?? null,
    })
    .select('*')
    .single();
  if (createError) return res.status(400).json({ message: createError.message });

  const { error: updateError } = await supabase
    .from('users')
    .update({ coordinates: { lat, lng } })
    .eq('id', targetVolunteerId);
  if (updateError) return res.status(400).json({ message: updateError.message });

  emitRealtimeEvent('location:updated', {
    volunteerId: targetVolunteerId,
    lat,
    lng,
      timestamp: location.timestamp || location.created_at,
    });

  res.status(201).json({ ...location, _id: location.id, volunteerId: location.volunteer_id });
};
