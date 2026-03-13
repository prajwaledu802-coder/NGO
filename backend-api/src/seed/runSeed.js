import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { supabase } from '../config/supabase.js';
import { seedEvents, seedResources, seedUsers } from './seedData.js';

dotenv.config();

const run = async () => {
  await connectDb();

  await Promise.all([
    supabase.from('users').delete().neq('id', ''),
    supabase.from('events').delete().neq('id', ''),
    supabase.from('resources').delete().neq('id', ''),
    supabase.from('volunteer_activities').delete().neq('id', ''),
  ]);

  const usersToInsert = await Promise.all(
    seedUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
      duty_status: user.dutyStatus || 'off-duty',
      hours_contributed: user.hoursContributed ?? 0,
      impact_score: user.impactScore ?? 0,
      events_joined: user.eventsJoined ?? 0,
    }))
  );

  const { data: users = [] } = await supabase.from('users').insert(usersToInsert).select('*');
  const admin = users.find((user) => user.role === 'admin');
  const volunteers = users.filter((user) => user.role === 'volunteer');

  const { data: seededEvents = [] } = await supabase
    .from('events')
    .insert(
      seedEvents.map((event, index) => ({
        ...event,
        resources_required: event.resourcesRequired || [],
        created_by: admin?.id,
        assigned_volunteers: volunteers.slice(0, Math.min(volunteers.length, index + 2)).map((v) => v.id),
      }))
    )
    .select('*');

  await supabase.from('resources').insert(
    seedResources.map((resource) => ({
      ...resource,
      resource_name: resource.resourceName,
    }))
  );

  const activityDocs = volunteers.flatMap((volunteer, index) => {
    const event = seededEvents[index % seededEvents.length];
    return {
      volunteer_id: volunteer.id,
      event_id: event.id,
      hours_contributed: 12 + index * 4,
      impact_score: 8 + index * 5,
      timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
    };
  });

  if (activityDocs.length) {
    await supabase.from('volunteer_activities').insert(activityDocs);
  }

  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
