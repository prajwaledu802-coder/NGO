export const overviewMetrics = {
  totalVolunteers: 1248,
  activeEvents: 27,
  availableResources: 382,
  volunteerHours: 18420,
};

export const volunteerActivity = [
  { name: 'Jan', volunteers: 310, growth: 9 },
  { name: 'Feb', volunteers: 360, growth: 11 },
  { name: 'Mar', volunteers: 410, growth: 14 },
  { name: 'Apr', volunteers: 470, growth: 16 },
  { name: 'May', volunteers: 530, growth: 13 },
  { name: 'Jun', volunteers: 620, growth: 18 },
  { name: 'Jul', volunteers: 690, growth: 21 },
];

export const resourceUsage = [
  { name: 'Food Kits', quantity: 240, distributed: 173 },
  { name: 'Medical Packs', quantity: 120, distributed: 86 },
  { name: 'Blankets', quantity: 180, distributed: 112 },
  { name: 'Water Tanks', quantity: 75, distributed: 51 },
  { name: 'Hygiene Kits', quantity: 205, distributed: 147 },
];

export const eventParticipation = [
  { name: 'Food Drive', participants: 142, target: 160 },
  { name: 'Health Camp', participants: 210, target: 220 },
  { name: 'Clean-up', participants: 168, target: 180 },
  { name: 'Relief Ops', participants: 253, target: 260 },
  { name: 'Workshop', participants: 112, target: 130 },
];

export const recentActivities = [
  { id: 'a1', title: 'Volunteer Maya Nair joined Flood Response event', time: '12m ago', type: 'volunteer' },
  { id: 'a2', title: 'Medical pack inventory updated at Mumbai Hub', time: '47m ago', type: 'resource' },
  { id: 'a3', title: 'New help request submitted from Kochi district', time: '2h ago', type: 'help' },
  { id: 'a4', title: 'Event created: Emergency Water Distribution', time: '3h ago', type: 'event' },
];

export const volunteers = [
  {
    _id: 'v1',
    name: 'Aarav Sharma',
    location: 'Delhi',
    status: 'Active',
    skills: ['First Aid', 'Logistics'],
    eventsParticipated: 16,
    hoursContributed: 196,
    impactScore: 92,
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 28.6139, lng: 77.209 },
  },
  {
    _id: 'v2',
    name: 'Maya Nair',
    location: 'Kochi',
    status: 'Active',
    skills: ['Coordination', 'Community Outreach'],
    eventsParticipated: 24,
    hoursContributed: 284,
    impactScore: 98,
    avatar:
      'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 9.9312, lng: 76.2673 },
  },
  {
    _id: 'v3',
    name: 'Rohan Das',
    location: 'Kolkata',
    skills: ['Data Entry', 'Transport'],
    eventsParticipated: 11,
    hoursContributed: 124,
    impactScore: 81,
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 22.5726, lng: 88.3639 },
  },
  {
    _id: 'v4',
    name: 'Priya Menon',
    location: 'Bengaluru',
    skills: ['Medical Support', 'Training'],
    eventsParticipated: 19,
    hoursContributed: 212,
    impactScore: 94,
    avatar:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 12.9716, lng: 77.5946 },
  },
  {
    _id: 'v5',
    name: 'Kabir Patel',
    location: 'Ahmedabad',
    skills: ['Operations', 'Shelter Management'],
    eventsParticipated: 22,
    hoursContributed: 238,
    impactScore: 96,
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 23.0225, lng: 72.5714 },
  },
  {
    _id: 'v6',
    name: 'Neha Kulkarni',
    location: 'Pune',
    status: 'Pending',
    skills: ['Fundraising', 'Field Reporting'],
    eventsParticipated: 14,
    hoursContributed: 162,
    impactScore: 86,
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    coordinates: { lat: 18.5204, lng: 73.8567 },
  },
];

export const events = [
  {
    _id: 'e1',
    name: 'Monsoon Relief Drive',
    date: '2026-03-21',
    location: 'Mumbai',
    volunteersAssigned: 132,
    resourcesUsed: 71,
    successRate: 94,
    coordinates: { lat: 19.076, lng: 72.8777 },
  },
  {
    _id: 'e2',
    name: 'Rural Health Outreach',
    date: '2026-03-26',
    location: 'Jaipur',
    volunteersAssigned: 98,
    resourcesUsed: 48,
    successRate: 89,
    coordinates: { lat: 26.9124, lng: 75.7873 },
  },
  {
    _id: 'e3',
    name: 'Women Safety Workshop',
    date: '2026-04-03',
    location: 'Hyderabad',
    volunteersAssigned: 76,
    resourcesUsed: 32,
    successRate: 92,
    coordinates: { lat: 17.385, lng: 78.4867 },
  },
  {
    _id: 'e4',
    name: 'School Supplies Campaign',
    date: '2026-04-09',
    location: 'Lucknow',
    volunteersAssigned: 113,
    resourcesUsed: 59,
    successRate: 90,
    coordinates: { lat: 26.8467, lng: 80.9462 },
  },
];

export const resources = [
  { _id: 'r1', name: 'Food Packs', quantity: 420, location: 'Delhi Depot', status: 'Available' },
  { _id: 'r2', name: 'Medical Kits', quantity: 96, location: 'Mumbai Hub', status: 'Low' },
  { _id: 'r3', name: 'Water Units', quantity: 62, location: 'Pune Center', status: 'Low' },
  { _id: 'r4', name: 'Emergency Tents', quantity: 28, location: 'Assam Storage', status: 'Critical' },
  { _id: 'r5', name: 'Solar Lamps', quantity: 214, location: 'Bengaluru Depot', status: 'Available' },
  { _id: 'r6', name: 'Education Kits', quantity: 33, location: 'Kolkata Branch', status: 'Critical' },
];

export const resourceCenters = [
  { _id: 'c1', name: 'Central Warehouse', location: 'Delhi', coordinates: { lat: 28.7041, lng: 77.1025 } },
  { _id: 'c2', name: 'South Resource Hub', location: 'Chennai', coordinates: { lat: 13.0827, lng: 80.2707 } },
  { _id: 'c3', name: 'East Relief Center', location: 'Bhubaneswar', coordinates: { lat: 20.2961, lng: 85.8245 } },
];

export const helpRequests = [
  {
    _id: 'h1',
    name: 'Anita Joseph',
    location: 'Kochi',
    typeOfHelp: 'Food and medicine',
    peopleAffected: 12,
    coordinates: { lat: 9.9252, lng: 76.2672 },
    priority: 'High',
  },
  {
    _id: 'h2',
    name: 'Ravi Kumar',
    location: 'Chennai',
    typeOfHelp: 'Clean drinking water',
    peopleAffected: 28,
    coordinates: { lat: 13.0674, lng: 80.2376 },
    priority: 'Critical',
  },
  {
    _id: 'h3',
    name: 'Meera Singh',
    location: 'Lucknow',
    typeOfHelp: 'Temporary shelter',
    peopleAffected: 9,
    coordinates: { lat: 26.8462, lng: 80.9467 },
    priority: 'Medium',
  },
];

export const emergencyStatus = {
  active: true,
  label: 'Flood Response',
  nearbyVolunteers: 14,
  availableKits: 120,
};

export const leaderboard = volunteers
  .map((volunteer) => ({
    _id: volunteer._id,
    name: volunteer.name,
    hoursServed: volunteer.hoursContributed,
    impactScore: volunteer.impactScore,
  }))
  .sort((a, b) => b.impactScore - a.impactScore);

export const profileActivityTimeline = [
  { name: 'Week 1', hours: 8 },
  { name: 'Week 2', hours: 12 },
  { name: 'Week 3', hours: 9 },
  { name: 'Week 4', hours: 14 },
  { name: 'Week 5', hours: 11 },
  { name: 'Week 6', hours: 17 },
];
