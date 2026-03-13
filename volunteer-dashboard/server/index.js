import "dotenv/config";
import cors from "cors";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json());

const state = {
  users: {
    demo: {
      id: "demo",
      name: "Demo Volunteer",
      skills: ["Coordination", "Community Outreach"],
      location: "Bengaluru",
      availability: "Weekends",
      photoURL: ""
    }
  },
  events: [
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
  ],
  activities: [
    {
      id: "act-1",
      userId: "demo",
      eventName: "Food Distribution Camp",
      date: "2026-02-10",
      hours: 4,
      status: "Completed"
    },
    {
      id: "act-2",
      userId: "demo",
      eventName: "Medical Camp",
      date: "2026-02-19",
      hours: 6,
      status: "Completed"
    }
  ],
  helpRequests: [
    {
      id: "help-1",
      location: "North Creek",
      type: "Emergency supplies",
      peopleAffected: 34,
      urgency: "emergency",
      lat: 12.989,
      lng: 77.592,
      responders: []
    },
    {
      id: "help-2",
      location: "Sunrise Colony",
      type: "Elderly transport",
      peopleAffected: 8,
      urgency: "medium",
      lat: 12.979,
      lng: 77.612,
      responders: []
    },
    {
      id: "help-3",
      location: "Hillview",
      type: "Meal kits",
      peopleAffected: 14,
      urgency: "low",
      lat: 12.968,
      lng: 77.6,
      responders: []
    }
  ],
  notifications: [
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
  ],
  certificates: {
    demo: {
      volunteerName: "Demo Volunteer",
      totalHours: 126,
      eventsCompleted: 18
    }
  },
  leaderboard: [
    { userId: "u1", score: 942 },
    { userId: "u2", score: 918 },
    { userId: "u3", score: 901 },
    { userId: "demo", score: 872 }
  ],
  chart: [
    { month: "Oct", hours: 16 },
    { month: "Nov", hours: 22 },
    { month: "Dec", hours: 18 },
    { month: "Jan", hours: 24 },
    { month: "Feb", hours: 28 },
    { month: "Mar", hours: 30 }
  ]
};

const defaultUserId = (userId) => userId || "demo";

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "ngo-nexus-api" });
});

app.get("/api/dashboard", (req, res) => {
  const userId = defaultUserId(req.query.userId);
  const activities = state.activities.filter((a) => a.userId === userId);
  const volunteerHours = activities.reduce((acc, item) => acc + Number(item.hours || 0), 0);
  const impactScore = state.leaderboard.find((entry) => entry.userId === userId)?.score || 530;

  res.json({
    stats: {
      eventsJoined: activities.length,
      volunteerHours,
      impactScore,
      upcomingEvents: state.events.length,
      impactLevel: impactScore >= 850 ? "Community Hero" : "Gold Volunteer"
    },
    feed: [
      "Joined Riverbank Cleanup Drive",
      "Completed volunteer task at Medical Camp",
      "New help request detected near North Creek"
    ]
  });
});

app.get("/api/events", (_req, res) => {
  res.json({ events: state.events });
});

app.post("/api/events/:id/join", (req, res) => {
  const userId = defaultUserId(req.body?.userId);
  const event = state.events.find((item) => item.id === req.params.id);

  if (!event) {
    res.status(404).json({ message: "Event not found" });
    return;
  }

  state.activities.unshift({
    id: `act-${Date.now()}`,
    userId,
    eventName: event.name,
    date: event.date,
    hours: 0,
    status: "Joined"
  });

  state.notifications.unshift({
    id: `n-${Date.now()}`,
    title: "Event joined",
    text: `You joined ${event.name}.`,
    time: "just now"
  });

  res.json({ success: true });
});

app.get("/api/activities", (req, res) => {
  const userId = defaultUserId(req.query.userId);
  res.json({ activities: state.activities.filter((item) => item.userId === userId) });
});

app.get("/api/help-requests", (_req, res) => {
  res.json({ helpRequests: state.helpRequests });
});

app.post("/api/help-requests/:id/respond", (req, res) => {
  const userId = defaultUserId(req.body?.userId);
  const request = state.helpRequests.find((item) => item.id === req.params.id);

  if (!request) {
    res.status(404).json({ message: "Request not found" });
    return;
  }

  if (!request.responders.includes(userId)) {
    request.responders.push(userId);
  }

  state.notifications.unshift({
    id: `n-${Date.now()}`,
    title: "Response recorded",
    text: `You responded to ${request.type} at ${request.location}.`,
    time: "just now"
  });

  res.json({ success: true });
});

app.get("/api/map-data", (_req, res) => {
  res.json({
    volunteers: [
      { id: "v1", name: "Active Volunteer Hub", lat: 12.975, lng: 77.593 },
      { id: "v2", name: "Rapid Response Unit", lat: 12.981, lng: 77.604 }
    ],
    resourceCenters: [
      { id: "r1", name: "Resource Center A", lat: 12.971, lng: 77.615 },
      { id: "r2", name: "Resource Center B", lat: 12.964, lng: 77.588 }
    ],
    events: state.events.map((event, idx) => ({
      ...event,
      lat: 12.968 + idx * 0.006,
      lng: 77.595 + idx * 0.004
    })),
    helpRequests: state.helpRequests
  });
});

app.get("/api/impact", (req, res) => {
  const userId = defaultUserId(req.query.userId);
  const score = state.leaderboard.find((entry) => entry.userId === userId)?.score || 530;
  const sorted = [...state.leaderboard].sort((a, b) => b.score - a.score);
  const rank = sorted.findIndex((entry) => entry.userId === userId) + 1 || sorted.length + 1;
  const activities = state.activities.filter((item) => item.userId === userId);

  res.json({
    score,
    rank,
    totalHours: activities.reduce((acc, item) => acc + Number(item.hours || 0), 0),
    progressPercent: Math.min(100, Math.round((score / 1000) * 100)),
    badges: ["Bronze Volunteer", "Silver Volunteer", "Gold Volunteer", "Community Hero"]
  });
});

app.get("/api/notifications", (_req, res) => {
  res.json({ notifications: state.notifications.slice(0, 15) });
});

app.get("/api/profile/:userId", (req, res) => {
  const userId = defaultUserId(req.params.userId);
  const profile = state.users[userId] || state.users.demo;
  const stats = {
    totalEvents: state.activities.filter((item) => item.userId === userId).length,
    totalHours: state.activities
      .filter((item) => item.userId === userId)
      .reduce((acc, item) => acc + Number(item.hours || 0), 0),
    rank: "#14"
  };

  res.json({ profile, stats, chart: state.chart });
});

app.put("/api/profile/:userId", (req, res) => {
  const userId = defaultUserId(req.params.userId);
  const existing = state.users[userId] || state.users.demo;
  const next = {
    ...existing,
    ...req.body
  };

  state.users[userId] = next;
  res.json({ success: true, profile: next });
});

app.get("/api/certificates/:userId", (req, res) => {
  const userId = defaultUserId(req.params.userId);
  const profile = state.users[userId] || state.users.demo;
  const activities = state.activities.filter((item) => item.userId === userId);

  res.json({
    volunteerName: profile.name,
    totalHours: activities.reduce((acc, item) => acc + Number(item.hours || 0), 0),
    eventsCompleted: activities.length
  });
});

app.listen(port, () => {
  console.log(`NGO Nexus API running on http://localhost:${port}`);
});
