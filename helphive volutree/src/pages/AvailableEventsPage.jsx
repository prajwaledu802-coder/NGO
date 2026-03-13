import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getEvents, joinEventApi } from "../services/apiClient";

export default function AvailableEventsPage({ user, onDuty }) {
  const [joiningId, setJoiningId] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let active = true;
    getEvents()
      .then((data) => {
        if (active) {
          setEvents(data.events || []);
        }
      })
      .catch(() => {
        if (active) {
          setEvents([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onJoin = async (event) => {
    if (!user || !onDuty) return;
    setJoiningId(event.id);
    try {
      await joinEventApi(event.id, user.uid);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <PageWrapper>
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {events.map((event) => (
          <motion.div whileHover={{ y: -4 }} key={event.id}>
            <TiltCard>
              <h3 className="font-display text-xl font-bold text-white">{event.name}</h3>
              <p className="mt-2 text-sm text-slate-300">Location: {event.location}</p>
              <p className="text-sm text-slate-300">Date: {event.date}</p>
              <p className="text-sm text-slate-300">Required volunteers: {event.requiredVolunteers}</p>
              <p className="text-sm text-slate-300">Skills: {event.skills.join(", ")}</p>

              <button
                onClick={() => onJoin(event)}
                disabled={joiningId === event.id || !onDuty}
                className={`mt-4 rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 transition ${onDuty ? "bg-sky-400 hover:bg-sky-300" : "off-duty-locked bg-slate-400 text-slate-700"} disabled:cursor-not-allowed`}
              >
                {!onDuty ? "Off Duty - Join Disabled" : joiningId === event.id ? "Joining..." : "Join Event"}
              </button>
            </TiltCard>
          </motion.div>
        ))}
      </section>
    </PageWrapper>
  );
}
