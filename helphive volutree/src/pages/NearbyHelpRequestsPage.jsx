import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getHelpRequests, respondToRequestApi } from "../services/apiClient";

const urgencyClass = {
  low: "bg-emerald-400/20 text-emerald-200",
  medium: "bg-amber-400/20 text-amber-200",
  emergency: "bg-red-400/20 text-red-200"
};

export default function NearbyHelpRequestsPage({ user, onDuty, onViewMap }) {
  const [working, setWorking] = useState(null);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    let active = true;
    getHelpRequests()
      .then((data) => {
        if (active) {
          setRequests(data.helpRequests || []);
        }
      })
      .catch(() => {
        if (active) {
          setRequests([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const onRespond = async (request) => {
    if (!user || !onDuty) return;
    setWorking(request.id);
    try {
      await respondToRequestApi(request.id, user.uid);
    } finally {
      setWorking(null);
    }
  };

  return (
    <PageWrapper>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {requests.map((request) => (
          <TiltCard key={request.id}>
            <p className="text-sm text-slate-300">Location: {request.location}</p>
            <p className="text-sm text-slate-300">Type of help: {request.type}</p>
            <p className="text-sm text-slate-300">People affected: {request.peopleAffected}</p>
            <span className={`mt-3 inline-flex rounded-full px-2 py-1 text-xs font-semibold ${urgencyClass[request.urgency]}`}>
              {request.urgency}
            </span>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onRespond(request)}
                disabled={!onDuty || working === request.id}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${onDuty ? "bg-emerald-300 text-slate-900" : "off-duty-locked bg-slate-400 text-slate-700"}`}
              >
                {!onDuty ? "Off Duty" : working === request.id ? "Responding..." : "Respond"}
              </button>
              <button
                onClick={() => onViewMap(request.id)}
                className="rounded-xl border border-sky-300/20 bg-sky-400/20 px-4 py-2 text-sm font-semibold text-sky-100"
              >
                View on Map
              </button>
            </div>
          </TiltCard>
        ))}
      </div>
    </PageWrapper>
  );
}
