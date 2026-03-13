import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AnimatedCounter from "../components/AnimatedCounter";
import PageWrapper from "../components/PageWrapper";
import SkeletonPanel from "../components/SkeletonPanel";
import TiltCard from "../components/TiltCard";
import {
  getActivities,
  getDashboard,
  getEvents,
  getHelpRequests
} from "../services/apiClient";

const fallbackStats = {
  eventsJoined: 18,
  volunteerHours: 126,
  impactScore: 872,
  upcomingEvents: 4,
  impactLevel: "Community Hero"
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 }
  }
};

const panelVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

export default function DashboardPage({ userId, onDuty }) {
  const [stats, setStats] = useState(fallbackStats);
  const [feed, setFeed] = useState([]);
  const [events, setEvents] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      getDashboard(userId),
      getEvents(),
      getHelpRequests(),
      getActivities(userId)
    ])
      .then(([dashboard, eventsData, requestsData, activitiesData]) => {
        if (!active) return;
        setStats(dashboard.stats || fallbackStats);
        setFeed(dashboard.feed || []);
        setEvents((eventsData.events || []).slice(0, 4));
        setRequests((requestsData.helpRequests || []).slice(0, 4));
        setActivities((activitiesData.activities || []).slice(0, 5));
      })
      .catch(() => {
        if (!active) return;
        setFeed([
          "Joined Riverbank Cleanup Drive",
          "Completed volunteer task at Medical Camp",
          "New help request detected near North Creek"
        ]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  const cards = [
    ["Events Joined", stats.eventsJoined, ""],
    ["Volunteer Hours", stats.volunteerHours, "h"],
    ["Impact Score", stats.impactScore, ""],
    ["Upcoming Events", stats.upcomingEvents, ""]
  ];

  if (loading) {
    return (
      <PageWrapper>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <SkeletonPanel key={idx} className="h-36" />
          ))}
        </section>
        <SkeletonPanel className="h-44" />
        <SkeletonPanel className="h-64" />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <motion.section variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div
        className="glass flex items-center justify-between rounded-2xl p-4"
        variants={panelVariants}
      >
        <p className="text-sm text-slate-300">Volunteer Status</p>
        <span className={`duty-badge ${onDuty ? "on" : "off"}`}>
          {onDuty ? "On Duty - Ready to Respond" : "Off Duty"}
        </span>
      </motion.div>

      <motion.section variants={panelVariants} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(([label, value, suffix], idx) => (
          <TiltCard key={label} delay={idx * 0.06}>
            <p className="text-sm text-slate-300">{label}</p>
            <AnimatedCounter to={value} suffix={suffix} />
          </TiltCard>
        ))}
      </motion.section>

      <motion.div variants={panelVariants}>
      <TiltCard>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-300">Impact Level</p>
            <h3 className="font-display text-2xl font-bold text-white">{stats.impactLevel}</h3>
          </div>
          <p className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
            Progress: 87%
          </p>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="impact-progress h-full rounded-full bg-gradient-to-r from-emerald-300 to-sky-300"
            initial={{ width: 0 }}
            animate={{ width: "87%" }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-300">
          <span>Starter</span>
          <span>Bronze</span>
          <span>Silver</span>
          <span>Gold</span>
          <span>Community Hero</span>
        </div>
      </TiltCard>
      </motion.div>

      <motion.section variants={panelVariants} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TiltCard delay={0.08}>
          <h3 className="font-display text-xl font-semibold text-white">Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <motion.div
                key={event.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
                whileHover={{ y: -2 }}
              >
                <p className="font-semibold text-white">{event.name}</p>
                <p className="text-xs text-slate-300">{event.location} | {event.date}</p>
              </motion.div>
            ))}
          </div>
        </TiltCard>

        <TiltCard delay={0.14}>
          <h3 className="font-display text-xl font-semibold text-white">Nearby Help Requests</h3>
          <div className="mt-4 space-y-3">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3"
                whileHover={{ y: -2 }}
              >
                <p className="font-semibold text-white">{request.type}</p>
                <p className="text-xs text-slate-300">
                  {request.location} | {request.peopleAffected} affected | {request.urgency}
                </p>
              </motion.div>
            ))}
          </div>
        </TiltCard>
      </motion.section>

      <motion.div variants={panelVariants}>
      <TiltCard delay={0.18}>
        <h3 className="font-display text-xl font-semibold text-white">Volunteer Activity Timeline</h3>
        <div className="mt-5 space-y-3">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.id}
              className="timeline-item"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <p className="font-semibold text-white">{activity.eventName}</p>
              <p className="text-xs text-slate-300">
                {activity.date} | {activity.hours}h | {activity.status}
              </p>
            </motion.div>
          ))}
        </div>
      </TiltCard>
      </motion.div>

      <motion.div variants={panelVariants}>
      <TiltCard delay={0.22}>
        <h3 className="font-display text-xl font-semibold text-white">Recent Activity Feed</h3>
        <div className="mt-4 space-y-2">
          {feed.map((entry, idx) => (
            <motion.div
              key={entry}
              className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.15 }}
            >
              {entry}
            </motion.div>
          ))}
        </div>
      </TiltCard>
      </motion.div>
      </motion.section>
    </PageWrapper>
  );
}
