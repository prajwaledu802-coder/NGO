import { Resource } from '../models/Resource.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getResources = async (_req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
};

export const createResource = async (req, res) => {
  const { resourceName, name, quantity, location, status } = req.body;

  if (!(resourceName || name) || quantity === undefined || !location) {
    return res.status(400).json({ message: 'resourceName, quantity and location are required' });
  }

  const resource = await Resource.create({
    resourceName: resourceName || name,
    quantity,
    location,
    status: status || 'available',
  });

  emitRealtimeEvent('resource:created', resource);
  res.status(201).json(resource);
};

export const updateResource = async (req, res) => {
  const resource = await Resource.findById(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });

  const mutable = ['resourceName', 'quantity', 'location', 'status'];
  mutable.forEach((field) => {
    if (req.body[field] !== undefined) resource[field] = req.body[field];
  });

  if (req.body.name !== undefined) resource.resourceName = req.body.name;

  await resource.save();
  emitRealtimeEvent('resource:updated', resource);
  res.json(resource);
};

export const deleteResource = async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ message: 'Resource not found' });

  emitRealtimeEvent('resource:deleted', { id: req.params.id });
  res.json({ message: 'Resource deleted' });
};
