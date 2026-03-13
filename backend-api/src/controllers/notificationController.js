import { supabase } from '../config/supabase.js';

export const getNotifications = async (req, res) => {
  let query = supabase.from('notifications').select('*').order('timestamp', { ascending: false }).limit(150);
  if (req.user.role !== 'admin') query = query.eq('user_id', req.user._id);
  const { data: notifications = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });
  res.json(notifications.map((item) => ({ ...item, _id: item.id, userId: item.user_id, readStatus: item.read_status })));
};

export const markNotificationRead = async (req, res) => {
  let query = supabase
    .from('notifications')
    .update({ read_status: true })
    .eq('id', req.params.id)
    .select('*')
    .maybeSingle();
  if (req.user.role !== 'admin') query = query.eq('user_id', req.user._id);
  const { data: notification, error } = await query;
  if (error) return res.status(400).json({ message: error.message });

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  res.json({ ...notification, _id: notification.id, userId: notification.user_id, readStatus: notification.read_status });
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
    user_id: id,
    message,
    type: type || 'info',
  }));

  const { data: notifications = [], error } = await supabase.from('notifications').insert(docs).select('*');
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json(notifications.map((item) => ({ ...item, _id: item.id, userId: item.user_id, readStatus: item.read_status })));
};
