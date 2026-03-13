import { Event } from '../models/Event.js';
import { Notification } from '../models/Notification.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
import { emitRealtimeEvent } from '../services/socketService.js';

export const getTasks = async (req, res) => {
  const query = {};

  if (req.user.role !== 'admin') {
    query.assignedVolunteer = req.user._id;
  }

  if (req.query.eventId) {
    query.eventId = req.query.eventId;
  }

  const tasks = await Task.find(query)
    .populate('assignedVolunteer', 'name email status dutyStatus location skills')
    .populate('eventId', 'title location date status')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, assignedVolunteer, eventId } = req.body;

  if (!title || !assignedVolunteer || !eventId) {
    return res.status(400).json({ message: 'title, assignedVolunteer and eventId are required' });
  }

  const [volunteer, event] = await Promise.all([
    User.findOne({ _id: assignedVolunteer, role: 'volunteer' }),
    Event.findById(eventId),
  ]);

  if (!volunteer) {
    return res.status(404).json({ message: 'Assigned volunteer not found' });
  }

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  const task = await Task.create({
    title,
    description: description || '',
    assignedVolunteer,
    eventId,
    status: 'assigned',
    createdBy: req.user._id,
  });

  await Notification.create({
    userId: volunteer._id,
    message: `Task assigned: ${title}`,
    type: 'info',
  });

  emitRealtimeEvent('task:assigned', {
    taskId: task._id,
    assignedVolunteer: volunteer._id,
    eventId: event._id,
    title: task.title,
  });

  res.status(201).json(task);
};

const transitionTask = async (req, res, status) => {
  const task = await Task.findById(req.params.id || req.body.taskId);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (req.user.role !== 'admin' && task.assignedVolunteer.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  task.status = status;
  await task.save();

  if (status === 'active') {
    await User.findByIdAndUpdate(task.assignedVolunteer, {
      dutyStatus: 'on-duty',
      availability: true,
    });
  }

  if (status === 'rejected') {
    await User.findByIdAndUpdate(task.assignedVolunteer, {
      dutyStatus: 'off-duty',
      availability: false,
    });
  }

  emitRealtimeEvent('task:status-updated', {
    taskId: task._id,
    status: task.status,
    volunteerId: task.assignedVolunteer,
  });

  res.json(task);
};

export const acceptTask = async (req, res) => transitionTask(req, res, 'active');
export const rejectTask = async (req, res) => transitionTask(req, res, 'rejected');