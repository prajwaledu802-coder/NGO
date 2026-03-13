import dotenv from 'dotenv';
import { connectDb } from '../config/db.js';
import { Event } from '../models/Event.js';
import { Resource } from '../models/Resource.js';
import { Volunteer } from '../models/Volunteer.js';
import { seedEvents, seedResources, seedVolunteers } from './seedData.js';

dotenv.config();

const run = async () => {
  await connectDb();

  await Promise.all([
    Volunteer.deleteMany({}),
    Event.deleteMany({}),
    Resource.deleteMany({}),
  ]);

  await Promise.all([
    Volunteer.insertMany(seedVolunteers),
    Event.insertMany(seedEvents),
    Resource.insertMany(seedResources),
  ]);

  console.log('Seed complete');
  process.exit(0);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
