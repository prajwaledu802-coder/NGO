import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const [topVolunteer, setTopVolunteer] = useState(null);

  useEffect(() => {
    api.get('/volunteers').then((res) => setTopVolunteer(res.data[0] || null));
  }, []);

  return (
    <section>
      <PageHeader title="Profile" subtitle="Volunteer profile and achievements" />
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Coordinator Profile</h3>
          <p>Name: {user?.fullName}</p>
          <p>Email: {user?.email}</p>
          <p>Skills: Coordination, Reporting, Logistics</p>
          <p>Total Hours Served: 180+</p>
          <p>Events Participated: 14</p>
        </article>

        <article className="glass rounded-2xl p-5">
          <h3 className="mb-3 font-semibold">Achievement Snapshot</h3>
          <p>Top Field Volunteer: {topVolunteer?.name || 'N/A'}</p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs">Community Star</span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs">100+ Hours</span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs">Rapid Responder</span>
          </div>
        </article>
      </div>
    </section>
  );
};

export default ProfilePage;
