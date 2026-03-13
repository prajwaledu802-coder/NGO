import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { seedUsers } from '../seed/seedData.js';

export const ensureSeedUsers = async () => {
  const roleSeedUsers = seedUsers.filter((user) => user.role === 'admin' || user.role === 'volunteer');
  let created = 0;

  for (const userData of roleSeedUsers) {
    const { data: existing } = await supabase.from('users').select('id').eq('email', userData.email).maybeSingle();
    if (existing) continue;

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(userData.password, salt);
    await supabase.from('users').insert({
      ...userData,
      password,
      status: userData.status || 'approved',
    });
    created += 1;
  }

  return {
    totalSeedUsers: roleSeedUsers.length,
    created,
  };
};
