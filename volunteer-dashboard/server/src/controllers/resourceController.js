import { supabase } from '../config/supabase.js';

const mapResource = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  name: row.name || row.resource_name || row.resourceName,
  createdAt: row.created_at || row.createdAt,
});

export const getResources = async (_req, res) => {
  const { data, error } = await supabase.from('resources').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ message: error.message });
  res.json((data || []).map(mapResource));
};

export const createResource = async (req, res) => {
  const { data, error } = await supabase
    .from('resources')
    .insert({
      name: req.body.name || req.body.resourceName,
      resource_name: req.body.resourceName || req.body.name,
      quantity: req.body.quantity,
      location: req.body.location,
      status: req.body.status || 'Available',
    })
    .select('*')
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(mapResource(data));
};
