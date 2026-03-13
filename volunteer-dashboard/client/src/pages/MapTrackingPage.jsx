import { useEffect, useMemo, useState } from 'react';
import MapContainer from '../components/MapContainer';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const MapTrackingPage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/volunteers'), api.get('/events')]).then(([v, e]) => {
      setVolunteers(v.data);
      setEvents(e.data);
    });
  }, []);

  const points = useMemo(
    () => [
      ...volunteers.map((v) => ({
        name: v.name,
        label: `Volunteer • ${v.location}`,
        lat: v.coordinates?.lat,
        lng: v.coordinates?.lng,
        type: 'volunteer',
      })),
      ...events.map((e) => ({
        name: e.name,
        label: `Event • ${e.location}`,
        lat: e.coordinates?.lat,
        lng: e.coordinates?.lng,
        type: 'event',
      })),
    ].filter((p) => p.lat && p.lng),
    [events, volunteers]
  );

  return (
    <section>
      <PageHeader title="Live Map Tracking" subtitle="Monitor volunteers, events, and resource hubs" />
      <MapContainer points={points} />
      <div className="glass mt-4 flex flex-wrap gap-4 rounded-2xl p-4 text-sm text-slate-300">
        <span>Legend:</span>
        <span className="rounded-full bg-cyan-500/20 px-3 py-1">Volunteer Marker</span>
        <span className="rounded-full bg-purple-500/20 px-3 py-1">Event Marker</span>
      </div>
    </section>
  );
};

export default MapTrackingPage;
