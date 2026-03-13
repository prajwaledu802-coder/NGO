import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { supabase } from '../config/supabase.js';
import { seedEvents, seedResources, seedVolunteers } from './seedData.js';

dotenv.config();

const run = async () => {
  await connectDb();

  await Promise.all([
    supabase.from('volunteers').delete().neq('id', ''),
    supabase.from('events').delete().neq('id', ''),
    supabase.from('resources').delete().neq('id', ''),
  ]);

  await Promise.all([
    supabase.from('volunteers').insert(
      seedVolunteers.map((volunteer) => ({
        ...volunteer,
        volunteer_role: volunteer.volunteerRole,
        hours_contributed: volunteer.hoursContributed,
        impact_score: volunteer.impactScore,
        events_participated: volunteer.eventsParticipated,
      }))
    ),
    supabase.from('events').insert(
      seedEvents.map((event) => ({
        ...event,
        volunteers_assigned: event.volunteersAssigned,
        resources_used: event.resourcesUsed,
        success_rate: event.successRate,
      }))
    ),
    supabase.from('resources').insert(
      seedResources.map((resource) => ({
        ...resource,
        resource_name: resource.name,
      }))
    ),
  ]);

  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
