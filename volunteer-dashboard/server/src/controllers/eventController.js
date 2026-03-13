import { Event } from '../models/Event.js';

export const getEvents = async (_req, res) => {
  const events = await Event.find().sort({ date: 1 });
  res.json(events);
};

export const createEvent = async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
};
