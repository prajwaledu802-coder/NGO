import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const HelpRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    location: '',
    typeOfHelp: '',
    peopleAffected: 1,
  });

  useEffect(() => {
    api
      .get('/help-requests')
      .then((res) => {
        setRequests(Array.isArray(res.data) ? res.data : []);
        setError('');
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to load help requests.'))
      .finally(() => setLoading(false));
  }, []);

  const totalPeopleAffected = useMemo(
    () => requests.reduce((acc, request) => acc + Number(request.peopleAffected || 0), 0),
    [requests]
  );

  const submitRequest = () => {
    if (!form.title || !form.location || !form.typeOfHelp) return;

    api
      .post('/help-requests', {
        title: form.title,
        location: form.location,
        description: form.typeOfHelp,
        peopleAffected: Number(form.peopleAffected) || 1,
        urgency: Number(form.peopleAffected) > 20 ? 'critical' : 'high',
      })
      .then((res) => {
        setRequests((prev) => [res.data, ...prev]);
        setForm({ title: '', location: '', typeOfHelp: '', peopleAffected: 1 });
        setError('');
      })
      .catch((err) => setError(err.response?.data?.message || 'Unable to create help request.'));
  };

  return (
    <section className="space-y-4">
      <PageHeader
        title="Help Requests"
        subtitle="Collect and track citizen requests for rapid NGO field response"
      />
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="glass rounded-xl p-4 lg:col-span-1">
          <h3 className="mb-3 font-semibold">Submit Help Request</h3>
          <div className="space-y-2">
            <input
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Request title"
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.typeOfHelp}
              onChange={(e) => setForm((prev) => ({ ...prev, typeOfHelp: e.target.value }))}
              placeholder="Type of help needed"
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
            />
            <input
              value={form.peopleAffected}
              onChange={(e) => setForm((prev) => ({ ...prev, peopleAffected: Number(e.target.value) }))}
              type="number"
              min="1"
              placeholder="People affected"
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
            />
            <AnimatedButton className="w-full" onClick={submitRequest}>Submit Request</AnimatedButton>
          </div>
        </div>

        <div className="glass rounded-xl p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Open Requests</h3>
            <span className="text-xs text-[var(--text-secondary)]">People affected: {totalPeopleAffected}</span>
          </div>
          <div className="space-y-2">
            {loading ? <p className="text-sm text-[var(--text-secondary)]">Loading requests...</p> : null}
            {requests.map((request, index) => (
              <motion.div
                key={request._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm"
              >
                <p className="font-medium text-[var(--text-primary)]">{request.title} | {request.location}</p>
                <p className="text-[var(--text-secondary)]">{request.description} | People affected: {request.peopleAffected || 0}</p>
                <span className="mt-1 inline-block rounded-full border border-rose-400/35 bg-rose-500/10 px-2 py-0.5 text-xs text-rose-200">
                  {request.urgency || request.priority}
                </span>
              </motion.div>
            ))}
            {!loading && !requests.length ? (
              <p className="text-sm text-[var(--text-secondary)]">No help requests found.</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpRequestsPage;
