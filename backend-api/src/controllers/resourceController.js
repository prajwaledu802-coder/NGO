import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const mapResource = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  resourceName: row.resource_name || row.resourceName || row.name,
  name: row.resource_name || row.resourceName || row.name,
  createdAt: row.created_at || row.createdAt,
});

export const getResources = async (_req, res) => {
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });
  res.json((data || []).map(mapResource));
};

export const createResource = async (req, res) => {
  const { resourceName, name, quantity, location, status } = req.body;

  if (!(resourceName || name) || quantity === undefined || !location) {
    return res.status(400).json({ message: 'resourceName, quantity and location are required' });
  }

  const { data: resource, error } = await supabase
    .from('resources')
    .insert({
      resource_name: resourceName || name,
      quantity,
      location,
      status: status || 'available',
    })
    .select('*')
    .single();
  if (error) return res.status(400).json({ message: error.message });

  const mapped = mapResource(resource);
  emitRealtimeEvent('resource:created', mapped);
  res.status(201).json(mapped);
};

export const updateResource = async (req, res) => {
  const updates = {};
  if (req.body.resourceName !== undefined) updates.resource_name = req.body.resourceName;
  if (req.body.name !== undefined) updates.resource_name = req.body.name;
  if (req.body.quantity !== undefined) updates.quantity = req.body.quantity;
  if (req.body.location !== undefined) updates.location = req.body.location;
  if (req.body.status !== undefined) updates.status = req.body.status;

  const { data: resource, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!resource) return res.status(404).json({ message: 'Resource not found' });

  const mapped = mapResource(resource);
  emitRealtimeEvent('resource:updated', mapped);
  res.json(mapped);
};

export const deleteResource = async (req, res) => {
  const { data: resource, error } = await supabase.from('resources').delete().eq('id', req.params.id).select('id').maybeSingle();
  if (error) return res.status(400).json({ message: error.message });
  if (!resource) return res.status(404).json({ message: 'Resource not found' });

  emitRealtimeEvent('resource:deleted', { id: req.params.id });
  res.json({ message: 'Resource deleted' });
};
