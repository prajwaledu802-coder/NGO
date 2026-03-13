import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getEvents = async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;

  const events = await Event.find(query)
    .populate('assignedVolunteers', 'name email status location skills')
    .populate('createdBy', 'name email')
    .sort({ date: 1 });

  res.json(events);
};

export const createEvent = async (req, res) => {
  const {
    title,
    name,
    description,
    location,
    date,
    volunteersRequired,
    resourcesRequired,
    assignedVolunteers,
    status,
    coordinates,
  } = req.body;

  if (!(title || name) || !location || !date) {
    return res.status(400).json({ message: 'title, location and date are required' });
  }

  const event = await Event.create({
    title: title || name,
    description: description || '',
    location,
    date,
    resourcesRequired: Array.isArray(resourcesRequired) ? resourcesRequired : [],
    volunteersRequired: Number(volunteersRequired) || 0,
    assignedVolunteers: Array.isArray(assignedVolunteers) ? assignedVolunteers : [],
    status: status || 'planned',
    createdBy: req.user._id,
    coordinates: coordinates || undefined,
  });

  const volunteers = await User.find({ role: 'volunteer', status: 'approved' }).select('_id');
  if (volunteers.length) {
    await Notification.insertMany(
      volunteers.map((volunteer) => ({
        userId: volunteer._id,
        message: `New Event Available: ${event.title}`,
        type: 'info',
      }))
    );
  }

  emitRealtimeEvent('event:new', event);
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const mutable = [
    'title',
    'description',
    'location',
    'date',
    'volunteersRequired',
    'resourcesRequired',
    'assignedVolunteers',
    'status',
    'coordinates',
  ];

  mutable.forEach((field) => {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  });

  if (req.body.name !== undefined) event.title = req.body.name;

  await event.save();
  emitRealtimeEvent('event:updated', event);
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  emitRealtimeEvent('event:deleted', { id: req.params.id });
  res.json({ message: 'Event deleted' });
};

export const assignVolunteersToEvent = async (req, res) => {
  const { volunteerIds } = req.body;
  if (!Array.isArray(volunteerIds)) {
    return res.status(400).json({ message: 'volunteerIds must be an array' });
  }

  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const volunteers = await User.find({ _id: { $in: volunteerIds }, role: 'volunteer' }).select('_id');
  const validIds = volunteers.map((v) => v._id.toString());

  const merged = new Set([...(event.assignedVolunteers || []).map((id) => id.toString()), ...validIds]);
  event.assignedVolunteers = [...merged];

  await event.save();

  await Notification.insertMany(
    validIds.map((id) => ({
      userId: id,
      message: `You have been assigned to event: ${event.title}`,
      type: 'info',
    }))
  );

  emitRealtimeEvent('event:assignment-updated', {
    eventId: event._id,
    assignedVolunteers: event.assignedVolunteers,
  });

  res.json(event);
};

export const joinEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: 'Event not found' });
  if (req.user.role !== 'volunteer') {
    return res.status(403).json({ message: 'Only volunteers can join events' });
  }

  const volunteerId = req.user._id.toString();
  const exists = (event.assignedVolunteers || []).some((id) => id.toString() === volunteerId);
  if (!exists) {
    event.assignedVolunteers.push(req.user._id);
    await event.save();
  }

  await User.findByIdAndUpdate(req.user._id, { $inc: { eventsJoined: exists ? 0 : 1 } });

  await VolunteerActivity.create({
    volunteerId: req.user._id,
    eventId: event._id,
    hoursContributed: 0,
    impactScore: 5,
    completionStatus: 'joined',
  });

  emitRealtimeEvent('event:volunteer-joined', {
    eventId: event._id,
    volunteerId: req.user._id,
  });

  res.json(event);
};
