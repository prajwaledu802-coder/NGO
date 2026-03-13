import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

const signToken = (user) =>
  jwt.sign({ id: user.id || user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sanitizeUser = (user) => ({
  id: user.id || user._id,
  _id: user.id || user._id,
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
  createdAt: user.created_at || user.createdAt,
});

export const register = async (req, res) => {
  const { fullName, name, email, password, phone, location, skills, role } = req.body;
  if (!(fullName || name) || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const { data: exists } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (exists) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const normalizedRole = role === 'admin' ? 'admin' : 'volunteer';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const { data: user, error: createError } = await supabase
    .from('users')
    .insert({
      name: fullName || name,
      email,
      phone: phone || '',
      password: passwordHash,
      role: normalizedRole,
      status: normalizedRole === 'admin' ? 'approved' : 'pending',
      location: location || '',
      skills: Array.isArray(skills) ? skills : [],
      availability: true,
      duty_status: 'off-duty',
    })
    .select('*')
    .single();
  if (createError) {
    return res.status(400).json({ message: createError.message });
  }

  if (normalizedRole === 'volunteer') {
    const { data: admins } = await supabase.from('users').select('id').eq('role', 'admin');
    if (admins?.length) {
      await supabase.from('notifications').insert(
        admins.map((admin) => ({
          user_id: admin.id,
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
  const { data: user } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

  if (!user || !(await bcrypt.compare(password, user.password || ''))) {
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
