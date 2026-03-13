import { Location } from '../models/Location.js';
import { User } from '../models/User.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getLocations = async (req, res) => {
  const query = {};

  if (req.user.role !== 'admin') {
    query.volunteerId = req.user._id;
  }

  if (req.query.volunteerId && req.user.role === 'admin') {
    query.volunteerId = req.query.volunteerId;
  }

  const locations = await Location.find(query)
    .populate('volunteerId', 'name email status role coordinates location')
    .sort({ timestamp: -1 })
    .limit(300);

  res.json(locations);
};

export const createLocation = async (req, res) => {
  const { lat, lng, accuracy, volunteerId } = req.body;
  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ message: 'lat and lng are required' });
  }

  const targetVolunteerId = req.user.role === 'admin' && volunteerId ? volunteerId : req.user._id;

  const volunteer = await User.findOne({ _id: targetVolunteerId, role: 'volunteer' });
  if (!volunteer) {
    return res.status(404).json({ message: 'Volunteer not found for location update' });
  }

  const location = await Location.create({
    volunteerId: targetVolunteerId,
    lat,
    lng,
    accuracy: accuracy ?? null,
  });

  volunteer.coordinates = { lat, lng };
  await volunteer.save();

  emitRealtimeEvent('location:updated', {
    volunteerId: targetVolunteerId,
    lat,
    lng,
    timestamp: location.timestamp,
  });

  res.status(201).json(location);
};
