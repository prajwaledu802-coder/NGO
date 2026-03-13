export const summaryStats = {
  eventsJoined: 18,
  volunteerHours: 126,
  impactScore: 872,
  upcomingEvents: 4,
  impactLevel: "Community Hero"
};

export const availableEvents = [
  {
    id: "event-1",
    name: "Riverbank Cleanup Drive",
    location: "Eastside Park",
    date: "2026-03-20",
    requiredVolunteers: 24,
    skills: ["Waste Management", "Teamwork"]
  },
  {
    id: "event-2",
    name: "Food Distribution Camp",
    location: "City Shelter Block A",
    date: "2026-03-22",
    requiredVolunteers: 18,
    skills: ["Coordination", "Logistics"]
  },
  {
    id: "event-3",
    name: "Community Health Awareness",
    location: "Greenfield Community Hall",
    date: "2026-03-26",
    requiredVolunteers: 12,
    skills: ["Communication", "Registration"]
  }
];

export const myActivities = [
  {
    id: "act-1",
    eventName: "Food Distribution Camp",
    date: "2026-02-10",
    hours: 4,
    status: "Completed"
  },
  {
    id: "act-2",
    eventName: "Medical Camp",
    date: "2026-02-19",
    hours: 6,
    status: "Completed"
  },
  {
    id: "act-3",
    eventName: "Tree Plantation",
    date: "2026-03-01",
    hours: 5,
    status: "Completed"
  }
];

export const helpRequests = [
  {
    id: "help-1",
    location: "North Creek",
    type: "Emergency supplies",
    peopleAffected: 34,
    urgency: "emergency",
    lat: 12.989,
    lng: 77.592
  },
  {
    id: "help-2",
    location: "Sunrise Colony",
    type: "Elderly transport",
    peopleAffected: 8,
    urgency: "medium",
    lat: 12.979,
    lng: 77.612
  },
  {
    id: "help-3",
    location: "Hillview",
    type: "Meal kits",
    peopleAffected: 14,
    urgency: "low",
    lat: 12.968,
    lng: 77.6
  }
];

export const notifications = [
  {
    id: "n-1",
    title: "New event available",
    text: "Riverbank Cleanup Drive needs 10 more volunteers.",
    time: "5m ago"
  },
  {
    id: "n-2",
    title: "Help request nearby",
    text: "Emergency supplies requested in North Creek.",
    time: "23m ago"
  },
  {
    id: "n-3",
    title: "Achievement unlocked",
    text: "You earned the Gold Volunteer badge.",
    time: "1h ago"
  }
];

export const activityChart = [
  { month: "Oct", hours: 16 },
  { month: "Nov", hours: 22 },
  { month: "Dec", hours: 18 },
  { month: "Jan", hours: 24 },
  { month: "Feb", hours: 28 },
  { month: "Mar", hours: 30 }
];
