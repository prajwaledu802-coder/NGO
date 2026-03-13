import { Activity, CalendarClock, PackageCheck, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import ResourceBarChart from '../components/charts/ResourceBarChart';
import VolunteerLineChart from '../components/charts/VolunteerLineChart';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import { api } from '../services/api';

const demoOverview = {
  metrics: {
    totalVolunteers: 286,
    activeEvents: 12,
    availableResources: 48,
    volunteerHours: 4120,
  },
  activitySeries: [
    { name: 'Mon', volunteers: 48 },
    { name: 'Tue', volunteers: 72 },
    { name: 'Wed', volunteers: 66 },
    { name: 'Thu', volunteers: 89 },
    { name: 'Fri', volunteers: 96 },
    { name: 'Sat', volunteers: 112 },
    { name: 'Sun', volunteers: 75 },
  ],
  resourceSeries: [
    { name: 'Food Kits', quantity: 320 },
    { name: 'Medical Packs', quantity: 76 },
    { name: 'Water Units', quantity: 59 },
  ],
  recentEvents: [
    { _id: 'd1', name: 'Urban Food Drive', date: new Date().toISOString(), location: 'Delhi' },
    { _id: 'd2', name: 'Rural Health Camp', date: new Date().toISOString(), location: 'Jaipur' },
    { _id: 'd3', name: 'Education Support Day', date: new Date().toISOString(), location: 'Lucknow' },
  ],
};

const DashboardPage = () => {
  const [overview, setOverview] = useState({
    metrics: {
      totalVolunteers: 0,
      activeEvents: 0,
      availableResources: 0,
      volunteerHours: 0,
    },
    activitySeries: [],
    resourceSeries: [],
    recentEvents: [],
  });

  useEffect(() => {
    api
      .get('/dashboard/overview')
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(demoOverview));
  }, []);

  return (
    <section>
      <PageHeader title="Dashboard" subtitle="Operational snapshot of your NGO network" />

      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Volunteers" value={overview.metrics.totalVolunteers} icon={Users} colorClass="bg-blue-700" />
        <StatCard title="Active Events" value={overview.metrics.activeEvents} icon={CalendarClock} colorClass="bg-violet-700" />
        <StatCard title="Available Resources" value={overview.metrics.availableResources} icon={PackageCheck} colorClass="bg-emerald-700" />
        <StatCard title="Volunteer Hours" value={overview.metrics.volunteerHours} icon={Activity} colorClass="bg-amber-600" />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <VolunteerLineChart data={overview.activitySeries} />
        <ResourceBarChart data={overview.resourceSeries} />
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h3 className="mb-3 font-semibold">Recent Event Activity</h3>
        <div className="space-y-2">
          {overview.recentEvents.map((event) => (
            <div key={event._id} className="rounded-lg border border-slate-700/50 bg-slate-900/40 px-3 py-2 text-sm">
              {event.name} • {new Date(event.date).toLocaleDateString()} • {event.location}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
