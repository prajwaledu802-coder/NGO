import { User } from '../models/User.js';
import { seedUsers } from '../seed/seedData.js';

export const ensureSeedUsers = async () => {
  const roleSeedUsers = seedUsers.filter((user) => user.role === 'admin' || user.role === 'volunteer');
  let created = 0;

  for (const userData of roleSeedUsers) {
    const existing = await User.findOne({ email: userData.email }).select('_id');
    if (existing) continue;

    await User.create({
      ...userData,
      status: userData.status || 'approved',
    });
    created += 1;
  }

  return {
    totalSeedUsers: roleSeedUsers.length,
    created,
  };
};