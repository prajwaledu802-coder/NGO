import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getProfile, saveProfile } from "../services/apiClient";

export default function ProfilePage({ user }) {
  const userId = user?.uid || "demo";
  const [form, setForm] = useState({
    name: user?.displayName || "",
    skills: "Coordination, Community Outreach",
    location: "Bengaluru",
    availability: "Weekends",
    photoURL: user?.photoURL || ""
  });
  const [stats, setStats] = useState({ totalEvents: 0, totalHours: 0, rank: "#-" });
  const [activityChart, setActivityChart] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile(userId)
      .then((data) => {
        if (!active) return;
        const profile = data.profile || {};
        setForm({
          name: profile.name || user?.displayName || "",
          skills: (profile.skills || []).join(", "),
          location: profile.location || "",
          availability: profile.availability || "",
          photoURL: profile.photoURL || user?.photoURL || ""
        });
        setStats(data.stats || { totalEvents: 0, totalHours: 0, rank: "#-" });
        setActivityChart(data.chart || []);
      })
      .catch(() => {
        if (!active) return;
        setStats({ totalEvents: 0, totalHours: 0, rank: "#-" });
      });

    return () => {
      active = false;
    };
  }, [userId, user?.displayName, user?.photoURL]);

  const saveProfile = async () => {
    if (!userId) return;
    setSaving(true);
    try {
      await saveProfile(userId, {
        name: form.name,
        skills: form.skills.split(",").map((s) => s.trim()),
        location: form.location,
        availability: form.availability,
        photoURL: form.photoURL
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <TiltCard>
          <h3 className="font-display text-xl font-semibold text-white">Edit Profile</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="Location"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
            <input
              value={form.availability}
              onChange={(e) => setForm((prev) => ({ ...prev, availability: e.target.value }))}
              placeholder="Availability"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
            <input
              value={form.photoURL}
              onChange={(e) => setForm((prev) => ({ ...prev, photoURL: e.target.value }))}
              placeholder="Profile photo URL"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
            />
            <textarea
              value={form.skills}
              onChange={(e) => setForm((prev) => ({ ...prev, skills: e.target.value }))}
              placeholder="Skills"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm md:col-span-2"
              rows={3}
            />
          </div>
          <button
            onClick={saveProfile}
            className="mt-4 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-semibold text-slate-900"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </TiltCard>

        <TiltCard>
          <h3 className="font-display text-xl font-semibold text-white">Personal Stats</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span>Total Events</span>
              <span className="font-semibold text-white">{stats.totalEvents}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span>Total Hours</span>
              <span className="font-semibold text-white">{stats.totalHours}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span>Current Rank</span>
              <span className="font-semibold text-white">{stats.rank}</span>
            </div>
          </div>
        </TiltCard>
      </div>

      <TiltCard>
        <h3 className="font-display text-xl font-semibold text-white">Activity Chart</h3>
        <div className="mt-4 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityChart}>
              <defs>
                <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#29d3a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#29d3a6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#243247" />
              <XAxis dataKey="month" stroke="#91a4bf" />
              <YAxis stroke="#91a4bf" />
              <Tooltip />
              <Area type="monotone" dataKey="hours" stroke="#29d3a6" fill="url(#hoursGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </TiltCard>
    </PageWrapper>
  );
}
