import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';
import { emitRealtimeEvent } from '../services/socketService.js';

const volunteerProjection =
  'name email phone role status dutyStatus location skills coordinates availability impactScore hoursContributed eventsJoined achievements createdAt';

const buildProfileImage = (volunteer) => {
  const seed = encodeURIComponent(volunteer.email || volunteer.name || String(volunteer._id));
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}`;
};

const mapVolunteer = (volunteer) => ({
  id: volunteer._id,
  _id: volunteer._id,
  name: volunteer.name,
  fullName: volunteer.name,
  email: volunteer.email,
  phone: volunteer.phone,
  role: volunteer.role,
  status: volunteer.status,
  dutyStatus: volunteer.dutyStatus,
  location: volunteer.location,
  skills: volunteer.skills,
  coordinates: volunteer.coordinates,
  availability: volunteer.availability,
  impactScore: volunteer.impactScore,
  hoursContributed: volunteer.hoursContributed,
  hoursWorked: volunteer.hoursContributed,
  eventsJoined: volunteer.eventsJoined,
  profileImage: buildProfileImage(volunteer),
  achievements: volunteer.achievements,
  createdAt: volunteer.createdAt,
});

export const getVolunteers = async (req, res) => {
  const { search, status, availability } = req.query;
  const query = { role: 'volunteer' };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
      { skills: { $elemMatch: { $regex: search, $options: 'i' } } },
    ];
  }

  if (status) {
    if (['on-duty', 'off-duty'].includes(status)) {
      query.dutyStatus = status;
    } else {
      query.status = status;
    }
  }
  if (availability !== undefined) {
    query.availability = availability === 'true';
  }

  const volunteers = await User.find(query).select(volunteerProjection).sort({ createdAt: -1 });
  res.json(volunteers.map(mapVolunteer));
};

export const createVolunteer = async (req, res) => {
  const { name, fullName, email, password, phone, location, skills, status, coordinates } = req.body;

  if (!(name || fullName) || !email || !password) {
    return res.status(400).json({ message: 'name, email and password are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Volunteer email already exists' });
  }

  const volunteer = await User.create({
    name: name || fullName,
    email,
    phone: phone || '',
    password,
    role: 'volunteer',
    status: status || (req.user?.role === 'admin' ? 'approved' : 'pending'),
    location: location || '',
    skills: Array.isArray(skills) ? skills : [],
    coordinates: coordinates || undefined,
    dutyStatus: 'off-duty',
  });

  if (req.user?.role !== 'admin') {
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins.length) {
      await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          message: `New volunteer registration: ${volunteer.name}`,
          type: 'info',
        }))
      );
    }
  }

  emitRealtimeEvent('volunteer:created', mapVolunteer(volunteer));
  res.status(201).json(mapVolunteer(volunteer));
};

export const getVolunteerById = async (req, res) => {
  const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' }).select(volunteerProjection);
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });
  res.json(mapVolunteer(volunteer));
};

export const updateVolunteer = async (req, res) => {
  const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' });
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const canSelfEdit = req.user.role === 'volunteer' && req.user._id.toString() === volunteer._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!canSelfEdit && !isAdmin) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const mutableFields = isAdmin
    ? [
        'name',
        'phone',
        'location',
        'skills',
        'coordinates',
        'availability',
        'status',
        'hoursContributed',
        'impactScore',
        'eventsJoined',
        'achievements',
      ]
    : ['name', 'phone', 'location', 'skills', 'coordinates', 'availability'];

  mutableFields.forEach((field) => {
    if (req.body[field] !== undefined) volunteer[field] = req.body[field];
  });

  if (req.body.fullName) volunteer.name = req.body.fullName;

  await volunteer.save();
  emitRealtimeEvent('volunteer:updated', mapVolunteer(volunteer));
  res.json(mapVolunteer(volunteer));
};

export const deleteVolunteer = async (req, res) => {
  const volunteer = await User.findOneAndDelete({ _id: req.params.id, role: 'volunteer' });
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  emitRealtimeEvent('volunteer:deleted', { id: req.params.id });
  res.json({ message: 'Volunteer deleted' });
};

export const approveVolunteer = async (req, res) => {
  const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' });
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const action = (req.body.action || 'approve').toLowerCase();
  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'action must be approve or reject' });
  }

  volunteer.status = action === 'approve' ? 'approved' : 'rejected';
  await volunteer.save();

  await Notification.create({
    userId: volunteer._id,
    message:
      action === 'approve'
        ? 'You have been approved.'
        : 'Your volunteer registration was rejected. Contact admin for details.',
    type: action === 'approve' ? 'success' : 'warning',
  });

  emitRealtimeEvent(action === 'approve' ? 'volunteer:approved' : 'volunteer:rejected', mapVolunteer(volunteer));
  res.json(mapVolunteer(volunteer));
};

export const updateDutyStatus = async (req, res) => {
  const volunteer = await User.findOne({ _id: req.params.id, role: 'volunteer' });
  if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

  const canSelfEdit = req.user.role === 'volunteer' && req.user._id.toString() === volunteer._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!canSelfEdit && !isAdmin) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  const dutyStatus = req.body.status || req.body.dutyStatus;
  if (!['on-duty', 'off-duty'].includes(dutyStatus)) {
    return res.status(400).json({ message: 'status must be on-duty or off-duty' });
  }

  volunteer.dutyStatus = dutyStatus;
  volunteer.availability = dutyStatus === 'on-duty';
  await volunteer.save();

  emitRealtimeEvent('volunteer:duty-updated', {
    volunteerId: volunteer._id,
    status: dutyStatus,
  });

  res.json(mapVolunteer(volunteer));
};

export const getVolunteerActivity = async (req, res) => {
  const volunteerId = req.params.id;
  const activities = await VolunteerActivity.find({ volunteerId })
    .populate('eventId', 'title location date status')
    .sort({ timestamp: -1 });

  res.json(activities);
};
