import { Notification } from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const query = req.user.role === 'admin' ? {} : { userId: req.user._id };

  const notifications = await Notification.find(query)
    .sort({ timestamp: -1 })
    .limit(150);

  res.json(notifications);
};

export const markNotificationRead = async (req, res) => {
  const query = { _id: req.params.id };
  if (req.user.role !== 'admin') {
    query.userId = req.user._id;
  }

  const notification = await Notification.findOneAndUpdate(
    query,
    { readStatus: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json(notification);
};

export const createNotification = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can create notifications' });
  }

  const { userIds, message, type } = req.body;
  if (!message || !Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ message: 'message and userIds are required' });
  }

  const docs = userIds.map((id) => ({
    userId: id,
    message,
    type: type || 'info',
  }));

  const notifications = await Notification.insertMany(docs);
  res.status(201).json(notifications);
};
