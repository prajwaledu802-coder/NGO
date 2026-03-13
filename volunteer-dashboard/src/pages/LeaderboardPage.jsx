import { Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/leaderboard')
      .then((res) => setLeaders(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load leaderboard.'));
  }, []);

  return (
    <section>
      <PageHeader
        title="Leaderboard"
        subtitle="Gamified ranking by impact score and service hours"
      />
      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}
      <div className="glass rounded-xl p-4">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="text-[var(--text-muted)]">
              <th className="pb-2">Rank</th>
              <th className="pb-2">Volunteer Name</th>
              <th className="pb-2">Events Joined</th>
              <th className="pb-2">Volunteer Hours</th>
              <th className="pb-2">Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((v, i) => (
              <tr key={v.volunteerId || v._id} className="border-t border-[var(--border-muted)]">
                <td className="py-3">#{i + 1}</td>
                <td className="py-3 flex items-center gap-2">
                  <Medal className="h-4 w-4 text-amber-300" /> {v.name}
                </td>
                <td className="py-3">{v.eventsJoined}</td>
                <td className="py-3">{v.hoursContributed}</td>
                <td className="py-3">
                  <div className="w-44">
                    <div className="mb-1">{v.impactScore}</div>
                    <div className="h-2 rounded-full bg-slate-700/45">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v.impactScore}%` }}
                        transition={{ duration: 0.7, delay: i * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LeaderboardPage;

