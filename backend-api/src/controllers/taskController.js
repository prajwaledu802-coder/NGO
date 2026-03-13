import { supabase } from '../config/supabase.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const mapTask = (task) => ({
  ...task,
  _id: task.id,
  assignedVolunteer: task.assigned_volunteer,
  eventId: task.event_id,
  createdBy: task.created_by,
  createdAt: task.created_at,
});

export const getTasks = async (req, res) => {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
  if (req.user.role !== 'admin') query = query.eq('assigned_volunteer', req.user._id);
  if (req.query.eventId) query = query.eq('event_id', req.query.eventId);

  const { data: tasks = [], error } = await query;
  if (error) return res.status(400).json({ message: error.message });
  res.json(tasks.map(mapTask));
};

export const createTask = async (req, res) => {
  const { title, description, assignedVolunteer, eventId } = req.body;
  if (!title || !assignedVolunteer || !eventId) {
    return res.status(400).json({ message: 'title, assignedVolunteer and eventId are required' });
  }

  const [{ data: volunteer }, { data: event }] = await Promise.all([
    supabase.from('users').select('id').eq('id', assignedVolunteer).eq('role', 'volunteer').maybeSingle(),
    supabase.from('events').select('id').eq('id', eventId).maybeSingle(),
  ]);

  if (!volunteer) return res.status(404).json({ message: 'Assigned volunteer not found' });
  if (!event) return res.status(404).json({ message: 'Event not found' });

  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .insert({
      title,
      description: description || '',
      assigned_volunteer: assignedVolunteer,
      event_id: eventId,
      status: 'assigned',
      created_by: req.user._id,
    })
    .select('*')
    .single();
  if (taskError) return res.status(400).json({ message: taskError.message });

  await supabase.from('notifications').insert({
    user_id: assignedVolunteer,
    message: `Task assigned: ${title}`,
    type: 'info',
  });

  emitRealtimeEvent('task:assigned', {
    taskId: task.id,
    assignedVolunteer,
    eventId,
    title: task.title,
  });

  res.status(201).json(mapTask(task));
};

const transitionTask = async (req, res, status) => {
  const targetId = req.params.id || req.body.taskId;
  const { data: task, error: taskError } = await supabase.from('tasks').select('*').eq('id', targetId).maybeSingle();
  if (taskError) return res.status(400).json({ message: taskError.message });
  if (!task) return res.status(404).json({ message: 'Task not found' });

  if (req.user.role !== 'admin' && String(task.assigned_volunteer) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const { data: updatedTask, error: updateTaskError } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', targetId)
    .select('*')
    .single();
  if (updateTaskError) return res.status(400).json({ message: updateTaskError.message });

  if (status === 'active') {
    await supabase
      .from('users')
      .update({ duty_status: 'on-duty', availability: true })
      .eq('id', updatedTask.assigned_volunteer);
  }

  if (status === 'rejected') {
    await supabase
      .from('users')
      .update({ duty_status: 'off-duty', availability: false })
      .eq('id', updatedTask.assigned_volunteer);
  }

  emitRealtimeEvent('task:status-updated', {
    taskId: updatedTask.id,
    status: updatedTask.status,
    volunteerId: updatedTask.assigned_volunteer,
  });

  res.json(mapTask(updatedTask));
};

export const acceptTask = async (req, res) => transitionTask(req, res, 'active');
export const rejectTask = async (req, res) => transitionTask(req, res, 'rejected');
