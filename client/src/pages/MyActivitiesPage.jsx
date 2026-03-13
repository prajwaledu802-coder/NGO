import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TiltCard from '../components/ui/TiltCard';
import { useAuth } from '../context/AuthContext';

export default function MyActivitiesPage() {
  const { token } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/activity', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (active) {
          const list = Array.isArray(data) ? data : (data.activities || []);
          setActivities(list);
        }
      })
      .catch(() => { if (active) setActivities([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-3 p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <TiltCard>
        <h3 className="font-['Sora'] text-xl font-semibold text-[var(--text-primary)]">Participation Timeline</h3>
        <div className="mt-5 space-y-4">
          {activities.length === 0 && (
            <p className="text-sm text-[var(--text-muted)]">No activities recorded yet.</p>
          )}
          {activities.map((activity, idx) => {
            const event = activity.eventId;
            return (
              <motion.div
                key={activity._id || idx}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4"
              >
                <p className="font-semibold text-[var(--text-primary)]">{event?.title || 'Event'}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {event?.location} &nbsp;|&nbsp; {event?.date ? new Date(event.date).toLocaleDateString() : ''}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Hours: {activity.hoursWorked ?? 0} &nbsp;|&nbsp; Score: {activity.impactScore ?? 0}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    activity.status === 'completed'
                      ? 'bg-emerald-400/15 text-emerald-300'
                      : 'bg-amber-400/15 text-amber-300'
                  }`}
                >
                  {activity.status || 'participated'}
                </span>
              </motion.div>
            );
          })}
        </div>
      </TiltCard>
    </div>
  );
}
