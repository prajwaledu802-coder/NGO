import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { User } from '../models/User.js';
import { VolunteerActivity } from '../models/VolunteerActivity.js';
import { seedEvents, seedResources, seedUsers } from './seedData.js';

dotenv.config();

const run = async () => {
  await connectDb();

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Resource.deleteMany({}),
    VolunteerActivity.deleteMany({}),
  ]);

  const users = await User.insertMany(seedUsers);
  const admin = users.find((user) => user.role === 'admin');
  const volunteers = users.filter((user) => user.role === 'volunteer');

  const seededEvents = await Event.insertMany(
    seedEvents.map((event, index) => ({
      ...event,
      createdBy: admin?._id,
      assignedVolunteers: volunteers.slice(0, Math.min(volunteers.length, index + 2)).map((v) => v._id),
    }))
  );

  await Resource.insertMany(seedResources);

  const activityDocs = volunteers.flatMap((volunteer, index) => {
    const event = seededEvents[index % seededEvents.length];
    return {
      volunteerId: volunteer._id,
      eventId: event._id,
      hoursContributed: 12 + index * 4,
      impactScore: 8 + index * 5,
      timestamp: new Date(Date.now() - index * 24 * 60 * 60 * 1000),
    };
  });

  await VolunteerActivity.insertMany(activityDocs);

  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
