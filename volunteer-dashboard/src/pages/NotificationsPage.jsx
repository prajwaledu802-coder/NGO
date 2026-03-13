import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import TiltCard from "../components/TiltCard";
import { getNotifications } from "../services/apiClient";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;
    getNotifications()
      .then((data) => {
        if (active) {
          setNotifications(data.notifications || []);
        }
      })
      .catch(() => {
        if (active) {
          setNotifications([]);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-3">
        {notifications.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <TiltCard>
              <p className="font-semibold text-white">{item.title}</p>
              <p className="text-sm text-slate-300">{item.text}</p>
              <p className="mt-2 text-xs text-slate-400">{item.time}</p>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </PageWrapper>
  );
}
