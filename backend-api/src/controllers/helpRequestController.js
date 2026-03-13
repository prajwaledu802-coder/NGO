import { HelpRequest } from '../models/HelpRequest.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getHelpRequests = async (req, res) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.urgency) query.urgency = req.query.urgency;

  const requests = await HelpRequest.find(query)
    .populate('createdBy', 'name email')
    .populate('assignedVolunteers', 'name email location skills')
    .sort({ createdAt: -1 });

  res.json(requests);
};

export const createHelpRequest = async (req, res) => {
  const { title, description, location, urgency, coordinates, peopleAffected } = req.body;

  if (!title || !location) {
    return res.status(400).json({ message: 'title and location are required' });
  }

  const request = await HelpRequest.create({
    title,
    description: description || '',
    location,
    urgency: urgency || 'medium',
    peopleAffected: Number(peopleAffected) > 0 ? Number(peopleAffected) : 1,
    createdBy: req.user._id,
    coordinates: coordinates || undefined,
  });

  const admins = await User.find({ role: 'admin' }).select('_id');
  if (admins.length) {
    await Notification.insertMany(
      admins.map((admin) => ({
        userId: admin._id,
        message: `Help request created: ${request.title}`,
        type: 'alert',
      }))
    );
  }

  emitRealtimeEvent('help-request:new', request);
  res.status(201).json(request);
};

export const assignHelpRequestVolunteers = async (req, res) => {
  const { volunteerIds } = req.body;
  if (!Array.isArray(volunteerIds)) {
    return res.status(400).json({ message: 'volunteerIds must be an array' });
  }

  const request = await HelpRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Help request not found' });

  const volunteers = await User.find({ _id: { $in: volunteerIds }, role: 'volunteer' }).select('_id');
  const validIds = volunteers.map((volunteer) => volunteer._id.toString());

  const merged = new Set([
    ...(request.assignedVolunteers || []).map((id) => id.toString()),
    ...validIds,
  ]);

  request.assignedVolunteers = [...merged];
  request.status = 'in-progress';
  await request.save();

  if (validIds.length) {
    await Notification.insertMany(
      validIds.map((id) => ({
        userId: id,
        message: `You were assigned to help request: ${request.title}`,
        type: 'info',
      }))
    );
  }

  emitRealtimeEvent('help-request:assigned', {
    helpRequestId: request._id,
    assignedVolunteers: request.assignedVolunteers,
  });

  res.json(request);
};

export const updateHelpRequestStatus = async (req, res) => {
  const { status } = req.body;
  if (!['open', 'in-progress', 'resolved', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const request = await HelpRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: 'Help request not found' });

  request.status = status;
  await request.save();

  emitRealtimeEvent('help-request:updated', request);
  res.json(request);
};
