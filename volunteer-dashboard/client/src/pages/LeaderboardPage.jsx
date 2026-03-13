import { Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    api.get('/dashboard/overview').then((res) => setLeaders(res.data.leaderboard || []));
  }, []);

  return (
    <section>
      <PageHeader title="Leaderboard" subtitle="Gamified impact and hours ranking" />
      <div className="glass rounded-2xl p-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-300">
              <th className="pb-2">Rank</th>
              <th className="pb-2">Volunteer</th>
              <th className="pb-2">Hours</th>
              <th className="pb-2">Impact Score</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((v, i) => (
              <tr key={v._id} className="border-t border-slate-700/40">
                <td className="py-3">#{i + 1}</td>
                <td className="py-3 flex items-center gap-2">
                  <Medal className="h-4 w-4 text-amber-300" /> {v.name}
                </td>
                <td className="py-3">{v.hoursContributed}</td>
                <td className="py-3">
                  <div className="w-44">
                    <div className="mb-1">{v.impactScore}</div>
                    <div className="h-2 rounded-full bg-slate-700">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: `${v.impactScore}%` }} />
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
