import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import SkeletonLoader from '../components/loader/SkeletonLoader';
import { StaggerItem, StaggerSection } from '../components/ui/StaggerSection';
import { api } from '../services/api';

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState({
    activitySeries: [],
    resourceSeries: [],
    eventSeries: [],
  });

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/overview'),
      api.get('/analytics/resource-usage'),
      api.get('/analytics/event-participation'),
    ])
      .then(([overviewRes, resourceRes, eventRes]) =>
        setOverview({
          activitySeries: overviewRes.data?.activitySeries?.length ? overviewRes.data.activitySeries : [],
          resourceSeries: (resourceRes.data || []).map((item) => ({
            name: item.resourceName,
            quantity: item.currentStock,
          })),
          eventSeries: (eventRes.data?.events || []).map((event) => ({
            name: event.title,
            participants: event.assignedCount,
            target: Math.max(1, event.assignedCount + 2),
          })),
        })
      )
      .catch((err) => setError(err.response?.data?.message || 'Unable to load analytics.'))
      .finally(() => setLoading(false));
  }, []);

  const pieColors = [
    'var(--primary)',
    'var(--secondary)',
    'color-mix(in srgb, var(--primary) 75%, var(--background) 25%)',
    'color-mix(in srgb, var(--secondary) 65%, var(--text) 35%)',
    'color-mix(in srgb, var(--accent) 80%, var(--primary) 20%)',
  ];

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonLoader className="h-20 w-full" />
        <div className="grid gap-4 xl:grid-cols-2">
          <SkeletonLoader className="h-80 w-full" />
          <SkeletonLoader className="h-80 w-full" />
        </div>
        <SkeletonLoader className="h-80 w-full" />
      </section>
    );
  }

  return (
    <section className="space-y-5 pb-10 md:space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Volunteer growth trends, resource distribution, and event performance analytics"
      />
      {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

      <StaggerSection className="grid gap-4 xl:grid-cols-2">
        <StaggerItem className="glass rounded-xl p-4">
          <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Volunteer Growth Chart</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.activitySeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border-muted)',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                />
                <Bar dataKey="volunteers" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={950} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StaggerItem>

        <StaggerItem className="glass rounded-xl p-4">
          <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Resource Distribution Chart</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={overview.resourceSeries}
                  dataKey="quantity"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={65}
                  animationDuration={900}
                >
                  {overview.resourceSeries.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border-muted)',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </StaggerItem>
      </StaggerSection>

      <StaggerSection className="glass rounded-2xl p-4">
        <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Event Performance Analytics</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overview.eventSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.22)" />
              <XAxis dataKey="name" stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: '1px solid var(--border-muted)',
                  backgroundColor: 'var(--bg-elevated)',
                }}
              />
              <Bar dataKey="participants" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={800} />
              <Bar dataKey="target" fill="var(--secondary)" radius={[8, 8, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </StaggerSection>
    </section>
  );
};

export default AnalyticsPage;

