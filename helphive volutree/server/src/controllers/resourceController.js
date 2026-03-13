import { Resource } from '../models/Resource.js';

export const getResources = async (_req, res) => {
  const resources = await Resource.find().sort({ createdAt: -1 });
  res.json(resources);
};

export const createResource = async (req, res) => {
  const resource = await Resource.create(req.body);
  res.status(201).json(resource);
};
