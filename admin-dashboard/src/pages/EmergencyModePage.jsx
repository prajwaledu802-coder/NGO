import { AlertTriangle, Flame, Package, Users } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const EmergencyModePage = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/volunteers?status=on-duty'),
      api.get('/events?status=active'),
      api.get('/resources'),
    ])
      .then(([volRes, eventRes, resRes]) => {
        setVolunteers(Array.isArray(volRes.data) ? volRes.data : []);
        setEvents(Array.isArray(eventRes.data) ? eventRes.data : []);
        setResources(Array.isArray(resRes.data) ? resRes.data : []);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load emergency data.'));
  }, []);

  const criticalEvents = useMemo(
    () => events.filter((event) => ['active', 'planned'].includes(event.status)).slice(0, 5),
    [events]
  );

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-rose-200">Emergency Mode Active</p>
        <h2 className="mt-1 font-['Outfit'] text-2xl font-bold text-rose-100">Regional Response Coordination</h2>
      </div>
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <PageHeader
        title="Emergency Mode"
        subtitle="Disaster response command panel for rapid volunteer and resource deployment"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <article className="glass rounded-xl p-4">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Nearby Volunteers</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{volunteers.length}</p>
          <Users className="mt-2 h-5 w-5 text-emerald-300" />
        </article>
        <article className="glass rounded-xl p-4">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Resource Centers Ready</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{resources.length}</p>
          <Package className="mt-2 h-5 w-5 text-cyan-300" />
        </article>
        <article className="glass rounded-xl p-4">
          <p className="mb-1 text-sm text-[var(--text-secondary)]">Emergency Events</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{criticalEvents.length}</p>
          <Flame className="mt-2 h-5 w-5 text-rose-300" />
        </article>
      </div>

      <div className="glass rounded-xl p-4">
        <h3 className="mb-3 flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4 text-rose-300" /> Active Emergency Events
        </h3>
        <div className="space-y-2">
          {criticalEvents.map((event) => (
            <div key={event._id} className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm">
              {event.title || event.name} | {event.location} | Volunteers assigned: {event.assignedVolunteers?.length || 0}
            </div>
          ))}
          {!criticalEvents.length ? <p className="text-sm text-[var(--text-secondary)]">No active emergency events.</p> : null}
        </div>
      </div>
    </section>
  );
};

export default EmergencyModePage;
