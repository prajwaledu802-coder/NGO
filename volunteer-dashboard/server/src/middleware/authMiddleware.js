import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase.from('users').select('*').eq('id', decoded.id).maybeSingle();
    if (error) return res.status(401).json({ message: 'Token validation failed' });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token user' });
    }

    req.user = { ...user, _id: user.id };
    next();
  } catch {
    res.status(401).json({ message: 'Token validation failed' });
  }
};
