import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getActivities } from "../services/apiClient";

export default function MyActivitiesPage({ userId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    let active = true;
    getActivities(userId)
      .then((data) => {
        if (active) {
          setActivities(data.activities || []);
        }
      })
      .catch(() => {
        if (active) {
          setActivities([]);
        }
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return (
    <PageWrapper>
      <TiltCard>
        <h3 className="font-display text-xl font-semibold text-white">Participation Timeline</h3>
        <div className="mt-5 space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">{activity.eventName}</p>
              <p className="text-sm text-slate-300">Date: {activity.date}</p>
              <p className="text-sm text-slate-300">Hours contributed: {activity.hours}</p>
              <p className="text-sm text-emerald-300">Status: {activity.status}</p>
            </div>
          ))}
        </div>
      </TiltCard>
    </PageWrapper>
  );
}
