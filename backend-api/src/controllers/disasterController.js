import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const mapDisaster = (item) => ({
  ...item,
  _id: item.id,
  createdBy: item.created_by,
  detectedAt: item.detected_at,
  createdAt: item.created_at,
});

export const getDisasters = async (req, res) => {
  let query = supabase.from('disasters').select('*').order('detected_at', { ascending: false }).limit(200);
  if (req.query.status) query = query.eq('status', req.query.status);
  const { data = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });
  res.json(data.map(mapDisaster));
};

export const createDisaster = async (req, res) => {
  const { type, location, severity, detectedAt, coordinates } = req.body;
  if (!type || !location) {
    return res.status(400).json({ message: 'type and location are required' });
  }

  const { data: disaster, error: disasterError } = await supabase
    .from('disasters')
    .insert({
      type,
      location,
      severity: severity || 'medium',
      detected_at: detectedAt || new Date().toISOString(),
      created_by: req.user._id,
      coordinates: coordinates || null,
      status: 'active',
    })
    .select('*')
    .single();
  if (disasterError) return res.status(400).json({ message: disasterError.message });

  const { data: volunteers = [] } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'volunteer')
    .eq('status', 'approved');

  if (volunteers.length) {
    await supabase.from('notifications').insert(
      volunteers.map((volunteer) => ({
        user_id: volunteer.id,
        message: `Disaster alert: ${disaster.type} reported at ${disaster.location}`,
        type: 'alert',
      }))
    );
  }

  const mapped = mapDisaster(disaster);
  emitRealtimeEvent('disaster:alert', mapped);
  res.status(201).json(mapped);
};
