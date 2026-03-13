import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  CalendarClock,
  Compass,
  LayoutDashboard,
  MapPinned,
  PackageCheck,
  Sparkles,
  TimerReset,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link } from 'react-router-dom';
import ResourceBarChart from '../components/charts/ResourceBarChart';
import VolunteerLineChart from '../components/charts/VolunteerLineChart';
import MapContainer from '../components/MapContainer';
import SkeletonLoader from '../components/loader/SkeletonLoader';
import PageHeader from '../components/ui/PageHeader';
import { StaggerItem, StaggerSection } from '../components/ui/StaggerSection';
import StatCard from '../components/ui/StatCard';
import { useSocket } from '../hooks/useSocket';
import { api } from '../services/api';

const emptyOverview = {
  metrics: {
    totalVolunteers: 0,
    activeEvents: 0,
    availableResources: 0,
    volunteerHours: 0,
  },
  activitySeries: [],
  resourceSeries: [],
  eventSeries: [],
  recentEvents: [],
  leaderboard: [],
};

const DashboardPage = () => {
  const [overview, setOverview] = useState(emptyOverview);
  const [recommendations, setRecommendations] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [openHelpRequests, setOpenHelpRequests] = useState(0);
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { connected, liveEvents } = useSocket();

  useEffect(() => {
    Promise.allSettled([
      api.get('/dashboard/overview'),
      api.get('/activity'),
      api.get('/help-requests?status=open'),
      api.post('/ai/recommend-volunteers', {}),
      api.get('/disaster'),
      api.get('/volunteers'),
      api.get('/events'),
      api.get('/resources'),
    ])
      .then(([
        overviewRes,
        activityRes,
        helpReqRes,
        recommendationRes,
        disastersRes,
        volunteersRes,
        eventsRes,
        resourcesRes,
      ]) => {
        if (overviewRes.status !== 'fulfilled') {
          throw overviewRes.reason;
        }

        if (activityRes.status !== 'fulfilled') {
          throw activityRes.reason;
        }

        if (helpReqRes.status !== 'fulfilled') {
          throw helpReqRes.reason;
        }

        setOverview({ ...emptyOverview, ...(overviewRes.value.data || {}) });
        setFeed(
          (activityRes.value.data || []).slice(0, 8).map((item) => ({
            id: item._id,
            title: item.eventId?.title
              ? `Worked on ${item.eventId.title}`
              : `Logged ${item.hoursContributed || 0} volunteer hours`,
            time: new Date(item.timestamp).toLocaleString(),
            type: 'activity',
          }))
        );
        setOpenHelpRequests(
          Array.isArray(helpReqRes.value.data) ? helpReqRes.value.data.length : 0
        );
        setRecommendations(
          recommendationRes.status === 'fulfilled'
            ? recommendationRes.value.data?.recommendations || []
            : []
        );
        setDisasters(
          disastersRes.status === 'fulfilled' && Array.isArray(disastersRes.value.data)
            ? disastersRes.value.data
            : []
        );

        const volunteers =
          volunteersRes.status === 'fulfilled' && Array.isArray(volunteersRes.value.data)
            ? volunteersRes.value.data
            : [];
        const events =
          eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value.data)
            ? eventsRes.value.data
            : [];
        const resources =
          resourcesRes.status === 'fulfilled' && Array.isArray(resourcesRes.value.data)
            ? resourcesRes.value.data
            : [];
        const helpRequests = Array.isArray(helpReqRes.value.data) ? helpReqRes.value.data : [];
        const alerts =
          disastersRes.status === 'fulfilled' && Array.isArray(disastersRes.value.data)
            ? disastersRes.value.data
            : [];

        const previewPoints = [
          ...volunteers.map((volunteer) => ({
            name: volunteer.name,
            label: `Volunteer | ${volunteer.location || 'Unknown'}`,
            lat: volunteer.coordinates?.lat,
            lng: volunteer.coordinates?.lng,
            type: 'volunteer',
          })),
          ...events.map((event) => ({
            name: event.title || event.name,
            label: `Event | ${event.location || 'Unknown'}`,
            lat: event.coordinates?.lat,
            lng: event.coordinates?.lng,
            type: 'event',
          })),
          ...resources.map((resource) => ({
            name: resource.resourceName || resource.name,
            label: `Resource | ${resource.location || 'Unknown'}`,
            lat: resource.coordinates?.lat,
            lng: resource.coordinates?.lng,
            type: 'resource',
          })),
          ...helpRequests.map((request) => ({
            name: request.title || 'Help Request',
            label: `Help | ${request.location || request.urgency || 'Open'}`,
            lat: request.coordinates?.lat,
            lng: request.coordinates?.lng,
            type: 'help',
          })),
          ...alerts.map((alert) => ({
            name: alert.type || 'Disaster Alert',
            label: `Disaster | ${alert.location || 'Unknown'}`,
            lat: alert.coordinates?.lat,
            lng: alert.coordinates?.lng,
            type: 'help',
          })),
        ]
          .filter((point) => point.lat && point.lng)
          .slice(0, 24);

        setMapPoints(previewPoints);
        setError('');
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Unable to load dashboard data.');
        setOverview(emptyOverview);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!liveEvents.length) return;

    const incoming = liveEvents[0];
    setFeed((prev) => {
      if (prev[0]?.id === incoming.id) return prev;

      return [
        {
          id: incoming.id,
          title: incoming.message,
          time: 'Just now',
          type: incoming.eventName,
        },
        ...prev,
      ].slice(0, 8);
    });
  }, [liveEvents]);

  const topVolunteers = useMemo(() => (overview.leaderboard || []).slice(0, 5), [overview.leaderboard]);

  if (loading) {
    return (
      <section className="space-y-4 pb-8">
        <SkeletonLoader className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonLoader className="h-36 w-full" />
          <SkeletonLoader className="h-36 w-full" />
          <SkeletonLoader className="h-36 w-full" />
          <SkeletonLoader className="h-36 w-full" />
        </div>
        <SkeletonLoader className="h-80 w-full" />
      </section>
    );
  }

  return (
    <section className="space-y-5 pb-10 md:space-y-6">
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {/* Hero / Summary */}
      <div className="particle-bg rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-5 md:p-6">
        <PageHeader
          title="HelpHive Dashboard"
          subtitle="Smart Volunteer and Resource Coordination Platform"
          action={
            <div
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold ${
                connected
                  ? 'border border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
                  : 'border border-amber-400/35 bg-amber-500/10 text-amber-200'
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'} timeline-dot-pulse`}
              />
              {connected ? 'Live Sync Connected' : 'Live Sync Reconnecting'}
            </div>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Volunteers"
            value={overview.metrics.totalVolunteers}
            icon={Users}
            colorClass="bg-gradient-to-br from-cyan-500 to-blue-600"
          />
          <StatCard
            title="Active Events"
            value={overview.metrics.activeEvents}
            icon={CalendarClock}
            colorClass="bg-gradient-to-br from-indigo-500 to-sky-600"
          />
          <StatCard
            title="Available Resources"
            value={overview.metrics.availableResources}
            icon={PackageCheck}
            colorClass="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Volunteer Hours"
            value={overview.metrics.volunteerHours}
            icon={Activity}
            colorClass="bg-gradient-to-br from-amber-500 to-orange-600"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <StaggerSection className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {[
          { to: '/volunteers', label: 'Manage Volunteers', icon: Users, color: 'from-cyan-500/20 to-blue-600/20 border-cyan-400/25' },
          { to: '/events', label: 'Create Event', icon: CalendarClock, color: 'from-indigo-500/20 to-sky-600/20 border-indigo-400/25' },
          { to: '/resources', label: 'Track Resources', icon: PackageCheck, color: 'from-emerald-500/20 to-teal-600/20 border-emerald-400/25' },
          { to: '/map-tracking', label: 'Open Map', icon: Compass, color: 'from-amber-500/20 to-orange-600/20 border-amber-400/25' },
        ].map((action) => (
          <StaggerItem key={action.to}>
            <Link to={action.to}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 rounded-xl border bg-gradient-to-br p-4 transition ${action.color}`}
              >
                <div className="rounded-lg bg-[var(--card-elevated)] p-2">
                  <action.icon className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{action.label}</span>
              </motion.div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerSection>

      {/* Volunteer Activity & Resource Charts */}
      <StaggerSection className="grid gap-4 xl:grid-cols-2">
        <StaggerItem>
          <VolunteerLineChart data={overview.activitySeries} />
        </StaggerItem>
        <StaggerItem>
          <ResourceBarChart data={overview.resourceSeries} />
        </StaggerItem>
      </StaggerSection>

      {/* Disaster Monitoring */}
      <StaggerSection className="glass rounded-xl p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-300" />
            <h3 className="font-['Outfit'] text-lg font-semibold">Disaster Monitoring</h3>
          </div>
          <span className="rounded-full border border-[var(--border-muted)] bg-[var(--card-elevated)] px-2 py-1 text-xs text-[var(--text-muted)]">
            {disasters.length} alerts
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {disasters.slice(0, 6).map((alert, idx) => (
            <StaggerItem key={alert._id}>
              <motion.article
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ y: -3 }}
                className={`rounded-xl border p-3 ${
                  alert.severity === 'high' || alert.severity === 'critical'
                    ? 'border-rose-400/30 bg-rose-500/10'
                    : 'border-[var(--border-muted)] bg-[var(--card-elevated)]'
                }`}
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {alert.type || 'Disaster Alert'}
                  </p>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    alert.severity === 'high' || alert.severity === 'critical'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {alert.severity || 'medium'}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">📍 {alert.location || 'N/A'}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                  Volunteers:{' '}
                  {(overview.metrics.totalVolunteers || 0) > 0 ? 'Available pool active' : 'None yet'}
                </p>
              </motion.article>
            </StaggerItem>
          ))}
          {!disasters.length ? (
            <p className="col-span-full text-sm text-[var(--text-secondary)]">No active disaster alerts found.</p>
          ) : null}
        </div>
      </StaggerSection>

      {/* Event Participation & Recent Events */}
      <StaggerSection className="grid gap-4 xl:grid-cols-5">
        <StaggerItem className="xl:col-span-3">
          <motion.article
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 14 }}
            viewport={{ once: true }}
            className="glass rounded-xl p-4"
          >
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-300" />
              <h3 className="font-['Outfit'] text-lg font-semibold">Event Participation</h3>
            </div>
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
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Bar dataKey="participants" fill="var(--primary)" radius={[8, 8, 0, 0]} animationDuration={900} />
                  <Bar dataKey="target" fill="var(--secondary)" radius={[8, 8, 0, 0]} animationDuration={1100} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.article>
        </StaggerItem>

        <StaggerItem className="xl:col-span-2">
          <article className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-indigo-300" />
              <h3 className="font-['Outfit'] text-lg font-semibold">Recent Events</h3>
            </div>
            <div className="space-y-2.5">
              {overview.recentEvents.slice(0, 4).map((event, idx) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2"
                >
                  <p className="text-sm font-medium text-[var(--text-primary)]">{event.title || event.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--text-muted)]">
                    {new Date(event.date).toLocaleDateString()} | {event.location}
                  </p>
                </motion.div>
              ))}
              {!overview.recentEvents.length ? (
                <p className="text-sm text-[var(--text-secondary)]">No recent events found.</p>
              ) : null}
            </div>
          </article>
        </StaggerItem>
      </StaggerSection>

      {/* Leaderboard, Map Preview, AI Insights */}
      <StaggerSection className="grid gap-4 xl:grid-cols-3">
        <StaggerItem>
          <article className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-300" />
              <h3 className="font-semibold">Volunteer Leaderboard</h3>
            </div>
            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              {topVolunteers.map((volunteer, index) => (
                <div key={volunteer._id}>
                  <div className="mb-1 flex items-center justify-between">
                    <span>
                      #{index + 1} {volunteer.name || volunteer.fullName}
                    </span>
                    <span>{volunteer.impactScore || 0}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-700/45">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(volunteer.impactScore || 0, 100)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.06 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    />
                  </div>
                </div>
              ))}
              {!topVolunteers.length ? <p>No volunteer activity yet.</p> : null}
            </div>
          </article>
        </StaggerItem>

        <StaggerItem>
          <article className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <MapPinned className="h-4 w-4 text-sky-300" />
              <h3 className="font-semibold">Live Map Preview</h3>
            </div>
            <p className="text-sm text-[var(--text-secondary)]">{openHelpRequests} active help markers near operations.</p>
            <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border-muted)]">
              <MapContainer points={mapPoints} heightClass="h-48" />
            </div>
            <Link
              to="/map-tracking"
              className="mt-3 inline-flex items-center gap-1 rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]"
            >
              <Compass className="h-3.5 w-3.5" />
              Open full map tracking
            </Link>
          </article>
        </StaggerItem>

        <StaggerItem>
          <article className="glass rounded-xl p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <h3 className="font-semibold">AI Insights Panel</h3>
            </div>
            <p className="mb-3 text-sm text-[var(--text-secondary)]">
              Recommendations are generated from current volunteer skills and impact data.
            </p>
            <div className="rounded-xl border border-cyan-400/25 bg-cyan-500/10 p-3 text-sm">
              <p className="mb-2 font-semibold text-cyan-100">AI Suggestion: Top volunteer matches</p>
              <ul className="space-y-1 text-[var(--text-secondary)]">
                {recommendations.slice(0, 4).map((row) => (
                  <motion.li
                    key={row.volunteerId || row.name}
                    initial={{ opacity: 0, x: 6 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    {row.name || row.volunteerName || 'Volunteer'} —{' '}
                    {row.reason || 'Recommended by ranking model'}
                  </motion.li>
                ))}
              </ul>
              {!recommendations.length ? (
                <p className="text-[var(--text-secondary)]">No recommendation data available.</p>
              ) : null}
            </div>
          </article>
        </StaggerItem>
      </StaggerSection>

      {/* Resource Usage & Activity Timeline */}
      <StaggerSection className="grid gap-4 xl:grid-cols-5">
        <StaggerItem className="xl:col-span-3">
          <article className="glass rounded-xl p-4">
            <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Resource Usage Graph</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={overview.resourceSeries}>
                  <defs>
                    <linearGradient id="resourceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="quantity"
                    stroke="var(--primary)"
                    fillOpacity={1}
                    fill="url(#resourceFill)"
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>
        </StaggerItem>

        <StaggerItem className="xl:col-span-2">
          <article className="glass rounded-xl p-4">
            <div className="mb-3 flex items-center gap-2">
              <TimerReset className="h-4 w-4 text-amber-300" />
              <h3 className="font-semibold">Live Activity Feed</h3>
            </div>
            <div className="relative space-y-0 pl-4">
              {/* timeline spine */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border-muted)]" />
              {feed.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative mb-2.5 pl-4"
                >
                  <span
                    className={`absolute left-0 top-2 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-elevated)] ${
                      idx === 0 ? 'bg-emerald-400 timeline-dot-pulse' : 'bg-[var(--border-muted)]'
                    }`}
                  />
                  <div className="rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2">
                    <p className="text-sm text-[var(--text-primary)]">{item.title}</p>
                    <p className="mt-0.5 text-xs uppercase tracking-wide text-[var(--text-muted)]">{item.time}</p>
                  </div>
                </motion.div>
              ))}
              {!feed.length ? (
                <p className="pl-4 text-sm text-[var(--text-secondary)]">No recent activity.</p>
              ) : null}
            </div>
          </article>
        </StaggerItem>
      </StaggerSection>

      {/* Platform Quick-links */}
      <StaggerSection className="glass rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-300" />
          <h3 className="font-semibold">Platform Navigation</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/analytics', label: 'Analytics' },
            { to: '/volunteers', label: 'Volunteers' },
            { to: '/events', label: 'Events' },
            { to: '/resources', label: 'Resources' },
            { to: '/map-tracking', label: 'Map Tracking' },
            { to: '/ai', label: 'AI Insights' },
            { to: 'help-requests', label: 'Help Requests' },
            { to: 'emergency', label: 'Emergency Mode' },
          ].map((link) => (
            <StaggerItem key={link.to}>
              <Link
                to={link.to}
                className="inline-block rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--text-primary)]"
              >
                {link.label}
              </Link>
            </StaggerItem>
          ))}
        </div>
      </StaggerSection>
    </section>
  );
};

export default DashboardPage;
