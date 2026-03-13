import { useEffect, useState } from 'react';
import ResourceBarChart from '../components/charts/ResourceBarChart';
import VolunteerLineChart from '../components/charts/VolunteerLineChart';
import PageHeader from '../components/ui/PageHeader';
import { api } from '../services/api';

const AnalyticsPage = () => {
  const [overview, setOverview] = useState({ activitySeries: [], resourceSeries: [], recentEvents: [] });

  useEffect(() => {
    api.get('/dashboard/overview').then((res) => setOverview(res.data));
  }, []);

  return (
    <section>
      <PageHeader title="Analytics & Reports" subtitle="Deep insight into volunteer and resource performance" />
      <div className="grid gap-4 xl:grid-cols-2">
        <VolunteerLineChart data={overview.activitySeries} />
        <ResourceBarChart data={overview.resourceSeries} />
      </div>

      <div className="glass mt-4 rounded-2xl p-4">
        <h3 className="mb-2 font-semibold">Event Success Overview</h3>
        <div className="space-y-2">
          {overview.recentEvents.map((event) => (
            <div key={event._id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{event.name}</span>
                <span>{event.successRate || 0}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                  style={{ width: `${event.successRate || 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsPage;
