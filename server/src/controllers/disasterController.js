import { Disaster } from '../models/Disaster.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getDisasters = async (req, res) => {
  const query = {};
  if (req.query.status) {
    query.status = req.query.status;
  }

  const disasters = await Disaster.find(query)
    .populate('createdBy', 'name email')
    .sort({ detectedAt: -1 })
    .limit(200);

  res.json(disasters);
};

export const createDisaster = async (req, res) => {
  const { type, location, severity, detectedAt, coordinates } = req.body;
  if (!type || !location) {
    return res.status(400).json({ message: 'type and location are required' });
  }

  const disaster = await Disaster.create({
    type,
    location,
    severity: severity || 'medium',
    detectedAt: detectedAt || new Date(),
    createdBy: req.user._id,
    coordinates: coordinates || undefined,
  });

  const volunteers = await User.find({ role: 'volunteer', status: 'approved' }).select('_id location');

  if (volunteers.length) {
    const docs = volunteers.map((volunteer) => ({
      userId: volunteer._id,
      message: `Disaster alert: ${disaster.type} reported at ${disaster.location}`,
      type: 'alert',
    }));
    await Notification.insertMany(docs);
  }

  emitRealtimeEvent('disaster:alert', disaster);
  res.status(201).json(disaster);
};