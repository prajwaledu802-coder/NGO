import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import TiltCard from '../components/ui/TiltCard';
import { useAuth } from '../context/AuthContext';

const fallback = {
  score: 0,
  rank: 0,
  totalHours: 0,
  progressPercent: 0,
  badges: ['Bronze Volunteer', 'Silver Volunteer', 'Gold Volunteer', 'Community Hero'],
};

export default function ImpactScorePage() {
  const { user, token } = useAuth();
  const [impact, setImpact] = useState(fallback);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`/api/volunteer/impact`, { headers })
      .then((r) => r.json())
      .then((data) => {
        if (active) {
          setImpact({
            score: data.impactScore ?? 0,
            rank: data.rank ?? 0,
            totalHours: data.hoursContributed ?? 0,
            progressPercent: data.progressPercent ?? Math.min(100, Math.round(((data.impactScore ?? 0) / 1000) * 100)),
            badges: data.badges ?? fallback.badges,
          });
        }
      })
      .catch(() => {
        if (active) {
          setImpact({
            ...fallback,
            score: user?.impactScore ?? 0,
            totalHours: user?.hoursContributed ?? 0,
          });
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, token]);

  const stat = (label, value) => (
    <TiltCard>
      <p className="text-sm text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 font-['Sora'] text-4xl font-bold text-[var(--text-primary)]">{value}</p>
    </TiltCard>
  );

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--surface-soft)]" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stat('Volunteer Score', impact.score)}
        {stat('Rank', impact.rank ? `#${impact.rank}` : '—')}
        {stat('Total Hours', `${impact.totalHours}h`)}
      </div>

      <TiltCard>
        <p className="text-sm text-[var(--text-secondary)]">Progress to next rank</p>
        <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${impact.progressPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--text-muted)]">{impact.progressPercent}%</p>
      </TiltCard>

      <TiltCard>
        <h3 className="font-['Sora'] text-xl font-semibold text-[var(--text-primary)]">Badge System</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {impact.badges.map((badge, idx) => (
            <div
              key={badge}
              className={`rounded-xl border p-3 text-center text-sm font-semibold ${
                idx < 2
                  ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                  : 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
              }`}
            >
              {badge}
            </div>
          ))}
        </div>
      </TiltCard>
    </div>
  );
}
