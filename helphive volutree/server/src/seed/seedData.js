export const seedVolunteers = [
  {
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    location: 'Delhi',
    skills: ['First Aid', 'Logistics'],
    volunteerRole: 'Field Volunteer',
    hoursContributed: 126,
    impactScore: 92,
    eventsParticipated: 8,
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  {
    name: 'Meera Iyer',
    email: 'meera@example.com',
    phone: '+91 99887 76655',
    location: 'Bengaluru',
    skills: ['Coordination', 'Community Outreach'],
    volunteerRole: 'Event Lead',
    hoursContributed: 148,
    impactScore: 96,
    eventsParticipated: 11,
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
];

export const seedEvents = [
  {
    name: 'Food Drive 2026',
    date: new Date(),
    location: 'Delhi NCR',
    description: 'Distribution of essentials to urban shelters',
    volunteersAssigned: 24,
    resourcesUsed: 80,
    successRate: 89,
    coordinates: { lat: 28.7041, lng: 77.1025 },
  },
  {
    name: 'Rural Health Camp',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    location: 'Jaipur',
    description: 'Medical checkup and medicine distribution camp',
    volunteersAssigned: 17,
    resourcesUsed: 52,
    successRate: 93,
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
];

export const seedResources = [
  { name: 'Food Kits', quantity: 320, location: 'Delhi Warehouse', status: 'Available' },
  { name: 'Medical Packs', quantity: 75, location: 'Jaipur Hub', status: 'Low' },
  { name: 'Water Units', quantity: 22, location: 'Central Depot', status: 'Critical' },
];
