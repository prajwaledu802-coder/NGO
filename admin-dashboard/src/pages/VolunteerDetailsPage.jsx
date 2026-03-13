import { useEffect, useState } from 'react';
import { MapPin, Sparkles, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import SkeletonLoader from '../components/loader/SkeletonLoader';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const VolunteerDetailsPage = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState(null);
  const [activity, setActivity] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    Promise.all([api.get(`/volunteers/${id}`), api.get(`/volunteers/${id}/activity`)])
      .then(([volunteerRes, activityRes]) => {
        setVolunteer(volunteerRes.data);
        setActivity(activityRes.data || []);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Unable to load volunteer details');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonLoader className="h-20 w-full" />
        <SkeletonLoader className="h-44 w-full" />
        <SkeletonLoader className="h-64 w-full" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-4">
        <PageHeader title="Volunteer Details" subtitle="Profile and contribution overview" />
        <div className="glass rounded-xl p-5 text-sm text-rose-300">{error}</div>
      </section>
    );
  }

  if (!volunteer) {
    return (
      <section className="space-y-4">
        <PageHeader title="Volunteer Details" subtitle="Profile and contribution overview" />
        <div className="glass rounded-xl p-5 text-sm text-[var(--text-secondary)]">Volunteer not found.</div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <PageHeader title="Volunteer Details" subtitle="Profile and contribution overview" />

      <article className="glass rounded-xl p-5">
        <div className="mb-4 flex items-center gap-4">
          <img
            src={volunteer.profileImage}
            alt={volunteer.name}
            className="h-16 w-16 rounded-full border border-[var(--border-muted)] bg-[var(--card-elevated)]"
          />
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{volunteer.name}</h2>
            <p className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
              <MapPin className="h-4 w-4" /> {volunteer.location || 'Unknown'}
            </p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)]">Skills: {(volunteer.skills || []).join(', ') || 'Not specified'}</p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-2 py-1 text-cyan-200">
            <Users className="mr-1 inline h-3 w-3" /> {volunteer.eventsJoined || 0} events joined
          </span>
          <span className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-2 py-1 text-emerald-200">
            {volunteer.hoursWorked || 0} volunteer hours
          </span>
          <span className="rounded-full border border-amber-300/25 bg-amber-500/10 px-2 py-1 text-amber-200">
            <Sparkles className="mr-1 inline h-3 w-3" /> {volunteer.impactScore || 0} impact score
          </span>
        </div>
      </article>

      <article className="glass rounded-xl p-5">
        <h3 className="mb-3 font-semibold">Recent Activity</h3>
        {activity.length ? (
          <div className="space-y-2">
            {activity.map((item) => (
              <div
                key={item._id}
                className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm"
              >
                <p className="font-medium text-[var(--text-primary)]">{item.eventId?.title || 'Event'}</p>
                <p className="text-[var(--text-secondary)]">
                  {new Date(item.timestamp).toLocaleDateString()} | Hours: {item.hoursContributed} | Impact: {item.impactScore}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-secondary)]">No activity recorded yet.</p>
        )}
      </article>
    </section>
  );
};

export default VolunteerDetailsPage;
