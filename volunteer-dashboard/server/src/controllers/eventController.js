import { supabase } from '../config/supabase.js';

const mapEvent = (row) => ({
  ...row,
  _id: row.id,
  id: row.id,
  name: row.name || row.title,
  volunteersAssigned: row.volunteers_assigned ?? row.volunteersAssigned ?? 0,
  resourcesUsed: row.resources_used ?? row.resourcesUsed ?? 0,
  successRate: row.success_rate ?? row.successRate ?? 80,
  createdAt: row.created_at || row.createdAt,
});

export const getEvents = async (_req, res) => {
  const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
  if (error) return res.status(400).json({ message: error.message });
  res.json((data || []).map(mapEvent));
};

export const createEvent = async (req, res) => {
  const payload = {
    name: req.body.name,
    title: req.body.title,
    date: req.body.date,
    location: req.body.location,
    description: req.body.description || '',
    volunteers_assigned: req.body.volunteersAssigned ?? req.body.volunteers_assigned ?? 0,
    resources_used: req.body.resourcesUsed ?? req.body.resources_used ?? 0,
    success_rate: req.body.successRate ?? req.body.success_rate ?? 80,
    coordinates: req.body.coordinates || null,
  };
  const { data, error } = await supabase.from('events').insert(payload).select('*').single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(mapEvent(data));
};
