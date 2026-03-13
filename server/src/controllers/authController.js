import jwt from 'jsonwebtoken';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  id: user._id,
  _id: user._id,
  name: user.name,
  fullName: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  status: user.status,
  location: user.location,
  skills: user.skills,
  coordinates: user.coordinates,
  availability: user.availability,
  impactScore: user.impactScore,
  hoursContributed: user.hoursContributed,
  eventsJoined: user.eventsJoined,
  createdAt: user.createdAt,
});

export const register = async (req, res) => {
  const { fullName, name, email, password, phone, location, skills, role } = req.body;
  if (!(fullName || name) || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const normalizedRole = role === 'admin' ? 'admin' : 'volunteer';
  const user = await User.create({
    name: fullName || name,
    email,
    phone: phone || '',
    password,
    role: normalizedRole,
    status: normalizedRole === 'admin' ? 'approved' : 'pending',
    location: location || '',
    skills: Array.isArray(skills) ? skills : [],
  });

  if (normalizedRole === 'volunteer') {
    const admins = await User.find({ role: 'admin' }).select('_id');
    if (admins.length) {
      await Notification.insertMany(
        admins.map((admin) => ({
          userId: admin._id,
          message: `New volunteer registration: ${user.name}`,
          type: 'info',
        }))
      );
    }
  }

  res.status(201).json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: signToken(user),
    user: sanitizeUser(user),
  });
};

export const me = async (req, res) => {
  res.json(sanitizeUser(req.user));
};
