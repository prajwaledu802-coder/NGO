import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { data: exists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const { data: user, error } = await supabase
    .from('users')
    .insert({ full_name: fullName, email, password: passwordHash, role: 'coordinator' })
    .select('*')
    .single();
  if (error) return res.status(400).json({ message: error.message });
  res.status(201).json({
    token: signToken(user.id),
    user: { id: user.id, fullName: user.full_name || user.fullName, email: user.email },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data: user } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

  if (!user || !(await bcrypt.compare(password, user.password || ''))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    token: signToken(user.id),
    user: { id: user.id, fullName: user.full_name || user.fullName, email: user.email },
  });
};

export const me = async (req, res) => {
  res.json(req.user);
};
