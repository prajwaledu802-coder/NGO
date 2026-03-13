import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import { StaggerItem, StaggerSection } from '../components/ui/StaggerSection';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const EventsPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    description: '',
    volunteersRequired: 0,
    requiredSkills: '',
    resourcesUsed: 0,
  });
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/events'), api.get('/volunteers?status=approved')])
      .then(([eventsRes, volunteersRes]) => {
        setEvents(Array.isArray(eventsRes.data) ? eventsRes.data : []);
        setVolunteers(Array.isArray(volunteersRes.data) ? volunteersRes.data : []);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load events.');
      });
  }, []);

  const handleCreateEvent = async () => {
    const skills = formData.requiredSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);

    const aiMatches = volunteers
      .filter((volunteer) => {
        const skillMatch = skills.length === 0 || skills.some((skill) => volunteer.skills?.includes(skill));
        const locationMatch = volunteer.location?.toLowerCase() === formData.location.toLowerCase();
        return skillMatch || locationMatch;
      })
      .slice(0, 3);

    setMatches(aiMatches);

    try {
      const payload = {
        title: formData.name,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        volunteersRequired: Number(formData.volunteersRequired) || 0,
        resourcesRequired: [],
        status: 'planned',
      };

      const { data } = await api.post('/events', payload);
      setEvents((prev) => [data, ...prev]);
      setFormData({
        name: '',
        date: '',
        location: '',
        description: '',
        volunteersRequired: 0,
        requiredSkills: '',
        resourcesUsed: 0,
      });
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event.');
    }
  };

  const handleJoinEvent = (eventId) => {
    api
      .post(`/events/${eventId}/join`)
      .then(({ data }) => {
        setEvents((prev) => prev.map((event) => (event._id === eventId ? data : event)));
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to join event.'));
  };

  const handleDeleteEvent = (eventId) => {
    api
      .delete(`/events/${eventId}`)
      .then(() => setEvents((prev) => prev.filter((event) => event._id !== eventId)))
      .catch((err) => setError(err.response?.data?.message || 'Unable to delete event.'));
  };

  return (
    <section className="space-y-5 pb-10 md:space-y-6">
      <PageHeader
        title="Events"
        subtitle="Create and monitor campaigns with volunteers, locations, and resource allocations"
        action={user?.role === 'admin' && <AnimatedButton onClick={() => setIsModalOpen(true)}>Create Event</AnimatedButton>}
      />

      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

      <StaggerSection className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <StaggerItem key={event._id}>
          <motion.article
            whileHover={{ y: -4 }}
            className="tilt-card glass rounded-xl p-5"
          >
            <h3 className="font-['Outfit'] text-xl font-semibold">{event.title || event.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <CalendarDays className="h-4 w-4" /> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="mt-1 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4" /> {event.location}
            </p>
            <p className="mt-2 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <Users className="h-4 w-4" /> Volunteers assigned: {event.assignedVolunteers?.length || 0}
            </p>
            <p className="text-sm text-[var(--text-secondary)]">Volunteers required: {event.volunteersRequired || 0}</p>
            <p className="text-sm text-[var(--text-secondary)]">Resources used: {event.resourcesRequired?.length || 0}</p>
            <p className="text-sm text-[var(--text-secondary)]">Status: {event.status || 'planned'}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700/45">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                style={{ width: `${event.successRate || 80}%` }}
              />
            </div>

            {user?.role === 'admin' ? (
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleDeleteEvent(event._id)}
                  className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-200"
                >
                  Delete
                </button>
              </div>
            ) : null}

            {user?.role === 'volunteer' && (
              <div className="mt-4">
                <AnimatedButton 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-1.5" 
                  onClick={() => handleJoinEvent(event._id)}
                >
                  Join Event
                </AnimatedButton>
              </div>
            )}
          </motion.article>
          </StaggerItem>
        ))}
        {!events.length ? <p className="text-sm text-[var(--text-secondary)]">No events available.</p> : null}
      </StaggerSection>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-slate-950/55"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--border-muted)] bg-[var(--bg-elevated)] p-5"
            >
              <h3 className="mb-4 font-['Outfit'] text-xl font-semibold">Create Event</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Event name"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  type="date"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.location}
                  onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="Location"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData((prev) => ({ ...prev, requiredSkills: e.target.value }))}
                  placeholder="Required skills (comma separated)"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.volunteersRequired}
                  onChange={(e) => setFormData((prev) => ({ ...prev, volunteersRequired: Number(e.target.value) }))}
                  type="number"
                  placeholder="Volunteers required"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
                />
                <input
                  value={formData.resourcesUsed}
                  onChange={(e) => setFormData((prev) => ({ ...prev, resourcesUsed: Number(e.target.value) }))}
                  type="number"
                  placeholder="Resources used"
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none sm:col-span-2"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-[var(--border-muted)] px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <AnimatedButton onClick={handleCreateEvent}>Create</AnimatedButton>
              </div>

              {matches.length > 0 && (
                <div className="mt-4 rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3">
                  <p className="mb-2 text-sm font-semibold text-cyan-200">AI Volunteer Match</p>
                  <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                    {matches.map((match) => (
                      <li key={match._id}>
                        {match.name} | {match.location} | {match.skills.join(', ')}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsPage;

