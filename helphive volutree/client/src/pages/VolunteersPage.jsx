import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const VolunteersPage = () => {
  const [search, setSearch] = useState('');
  const [volunteers, setVolunteers] = useState([]);

  const loadData = useCallback(() => {
    api.get(`/volunteers?search=${search}`).then((res) => setVolunteers(res.data));
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <section>
      <PageHeader
        title="Volunteer Management"
        subtitle="Search, add, and assign volunteers"
        action={<AnimatedButton onClick={loadData}>Refresh</AnimatedButton>}
      />

      <div className="mb-4 flex gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search volunteers"
          className="glass w-full rounded-xl px-3 py-2"
        />
        <AnimatedButton onClick={loadData}>Search</AnimatedButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {volunteers.map((v) => (
          <motion.article
            key={v._id}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-4"
          >
            <div className="mb-3 flex items-center gap-3">
              <img src={v.avatar} alt={v.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{v.name}</p>
                <p className="text-xs text-slate-300">{v.location}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300">Skills: {(v.skills || []).join(', ') || 'N/A'}</p>
            <p className="text-sm text-slate-300">Events: {v.eventsParticipated || 0}</p>
            <div className="mt-3 flex gap-2 text-xs">
              <button className="rounded-lg border border-slate-500 px-3 py-1">View Profile</button>
              <button className="rounded-lg bg-indigo-600 px-3 py-1">Assign to Event</button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
};

export default VolunteersPage;
