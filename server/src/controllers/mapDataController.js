import { Disaster } from '../models/Disaster.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';

export const getMapData = async (_req, res) => {
  const [volunteers, events, disasters] = await Promise.all([
    User.find({ role: 'volunteer', status: 'approved' }).select('name coordinates location').limit(100),
    Event.find({ status: 'active' }).select('title location coordinates date').limit(100),
    Disaster.find({ status: 'active' }).select('title location coordinates severity').limit(50),
  ]);

  const toPoint = (doc, labelField = 'name') => {
    const coords = doc.coordinates;
    if (!coords || !coords.lat || !coords.lng) return null;
    return { id: doc._id, name: doc[labelField] || doc.title || 'Unknown', lat: coords.lat, lng: coords.lng, location: doc.location };
  };

  res.json({
    volunteers: volunteers.map((v) => toPoint(v, 'name')).filter(Boolean),
    events: events.map((e) => ({ ...toPoint(e, 'title'), date: e.date })).filter(Boolean),
    helpRequests: disasters.map((d) => ({ ...toPoint(d, 'title'), severity: d.severity })).filter(Boolean),
    resourceCenters: [],
  });
};
