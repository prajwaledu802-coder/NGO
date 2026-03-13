import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import FloatingParticles from "./components/FloatingParticles";
import ShellLayout from "./components/ShellLayout";
import { useTheme } from "./context/ThemeContext";
import AvailableEventsPage from "./pages/AvailableEventsPage";
import CertificatesPage from "./pages/CertificatesPage";
import DashboardPage from "./pages/DashboardPage";
import ImpactScorePage from "./pages/ImpactScorePage";
import MyActivitiesPage from "./pages/MyActivitiesPage";
import NearbyHelpRequestsPage from "./pages/NearbyHelpRequestsPage";
import NotificationsPage from "./pages/NotificationsPage";

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const VolunteerMapPage = lazy(() => import("./pages/VolunteerMapPage"));

const demoUser = {
  uid: "demo",
  displayName: "Volunteer"
};

function RouteLoader() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="skeleton-panel h-32 rounded-2xl" />
      ))}
    </div>
  );
}

function AppRoutes({ user, onViewMap, onDuty }) {
  const userId = user?.uid || "demo";

  return (
    <Routes>
      <Route
        path="/dashboard"
        element={<DashboardPage userId={userId} onDuty={onDuty} />}
      />
      <Route path="/events" element={<AvailableEventsPage user={user} onDuty={onDuty} />} />
      <Route path="/activities" element={<MyActivitiesPage userId={userId} />} />
      <Route
        path="/requests"
        element={<NearbyHelpRequestsPage user={user} onDuty={onDuty} onViewMap={onViewMap} />}
      />
      <Route
        path="/map"
        element={(
          <Suspense fallback={<RouteLoader />}>
            <VolunteerMapPage />
          </Suspense>
        )}
      />
      <Route path="/impact" element={<ImpactScorePage userId={userId} />} />
      <Route path="/certificates" element={<CertificatesPage user={user} />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route
        path="/profile"
        element={(
          <Suspense fallback={<RouteLoader />}>
            <ProfilePage user={user} />
          </Suspense>
        )}
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  const navigate = useNavigate();
  const { theme, isDark, setTheme } = useTheme();
  const [onDuty, setOnDuty] = useState(() => localStorage.getItem("ngo-duty") !== "off");
  const [themeTransition, setThemeTransition] = useState(null);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("ngo-duty", onDuty ? "on" : "off");
  }, [onDuty]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const onToggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";

    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => {
        setTheme(nextTheme);
      });
      return;
    }

    setThemeTransition(nextTheme);
    setTheme(nextTheme);

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setThemeTransition(null);
      transitionTimerRef.current = null;
    }, 560);
  };

  return (
    <>
      <AnimatePresence>
        {themeTransition && (
          <motion.div
            key={`theme-transition-${themeTransition}`}
            className={`theme-transition-overlay ${themeTransition === "dark" ? "to-dark" : "to-light"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.42, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      <FloatingParticles />
      <ShellLayout
        user={demoUser}
        isDark={isDark}
        onDuty={onDuty}
        onToggleTheme={onToggleTheme}
        onToggleDuty={() => setOnDuty((prev) => !prev)}
      >
        <AppRoutes
          user={demoUser}
          onDuty={onDuty}
          onViewMap={() => {
            navigate("/map");
          }}
        />
      </ShellLayout>
    </>
  );
}
