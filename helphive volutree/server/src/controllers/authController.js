import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const user = await User.create({ fullName, email, password });
  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, fullName: user.fullName, email: user.email },
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};
