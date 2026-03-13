import { useEffect, useState } from 'react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data));
  }, []);

  return (
    <section>
      <PageHeader title="Event Management" subtitle="Plan and track all NGO activities" />

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <article key={event._id} className="glass rounded-2xl p-4">
            <h3 className="font-semibold">{event.name}</h3>
            <p className="text-sm text-slate-300">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
            <p className="mt-2 text-sm text-slate-300">Volunteers: {event.volunteersAssigned}</p>
            <p className="text-sm text-slate-300">Resources Used: {event.resourcesUsed}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${event.successRate}%` }} />
            </div>
          </article>
        ))}
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h3 className="mb-3 font-semibold">Create Event</h3>
        <p className="mb-3 text-sm text-slate-300">Event creation endpoint is active and can be connected to a form modal.</p>
        <AnimatedButton disabled className="cursor-not-allowed opacity-60">
          Form Ready for Extension
        </AnimatedButton>
      </div>
    </section>
  );
};

export default EventsPage;
