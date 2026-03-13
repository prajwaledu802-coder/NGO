import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";

import { getImpact } from "../services/apiClient";

const fallback = {
  score: 872,
  rank: 14,
  totalHours: 126,
  progressPercent: 73,
  badges: ["Bronze Volunteer", "Silver Volunteer", "Gold Volunteer", "Community Hero"]
};

export default function ImpactScorePage({ userId }) {
  const [impact, setImpact] = useState(fallback);

  useEffect(() => {
    let active = true;
    getImpact(userId)
      .then((data) => {
        if (active) {
          setImpact(data);
        }
      })
      .catch(() => {
        if (active) {
          setImpact(fallback);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <TiltCard>
          <p className="text-sm text-slate-300">Volunteer Score</p>
          <p className="font-display text-4xl font-bold text-white">{impact.score}</p>
        </TiltCard>
        <TiltCard>
          <p className="text-sm text-slate-300">Rank among volunteers</p>
          <p className="font-display text-4xl font-bold text-white">#{impact.rank}</p>
        </TiltCard>
        <TiltCard>
          <p className="text-sm text-slate-300">Total hours contributed</p>
          <p className="font-display text-4xl font-bold text-white">{impact.totalHours}</p>
        </TiltCard>
      </div>

      <TiltCard>
        <p className="text-sm text-slate-300">Progress to next rank</p>
        <div className="mt-3 h-3 w-full rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${impact.progressPercent}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300"
          />
        </div>
      </TiltCard>

      <TiltCard>
        <h3 className="font-display text-xl font-semibold text-white">Badge System</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {impact.badges.map((badge, idx) => (
            <div
              key={badge}
              className={`rounded-xl border p-3 text-center text-sm font-semibold ${idx < 3 ? "border-amber-300/20 bg-amber-300/10 text-amber-100" : "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"}`}
            >
              {badge}
            </div>
          ))}
        </div>
      </TiltCard>
    </PageWrapper>
  );
}
