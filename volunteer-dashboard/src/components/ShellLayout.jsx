import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "./Sidebar";
import RotatingGlobe from "./RotatingGlobe";

const titles = {
  "/dashboard": "Volunteer Dashboard",
  "/events": "Available Events",
  "/activities": "My Activities",
  "/requests": "Nearby Help Requests",
  "/map": "Volunteer Map",
  "/impact": "Impact Score",
  "/certificates": "Certificates",
  "/notifications": "Notifications",
  "/profile": "Profile"
};

export default function ShellLayout({
  children,
  user,
  isDark,
  onDuty,
  onToggleTheme,
  onToggleDuty
}) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [dutyRipple, setDutyRipple] = useState(0);
  const [themeRipple, setThemeRipple] = useState(0);

  const title = useMemo(() => {
    return titles[location.pathname] || "Volunteer Dashboard";
  }, [location.pathname]);

  return (
    <div className="min-h-screen px-4 pb-8 pt-4 md:px-6 md:pb-10 md:pt-6">
      <motion.div
        className={`hidden md:fixed md:bottom-6 md:top-6 md:block ${collapsed ? "md:w-[92px]" : "md:w-[286px]"}`}
        initial={false}
        animate={{ width: collapsed ? 92 : 286 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
      >
        <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((prev) => !prev)} />
      </motion.div>

      <div className="md:hidden">
        <Sidebar collapsed={false} onToggleCollapse={() => {}} />
      </div>

      <main
        className={`space-y-5 transition-all duration-300 md:min-h-[calc(100vh-48px)] ${collapsed ? "md:ml-[108px]" : "md:ml-[304px]"}`}
      >
        <header className="glass flex flex-wrap items-center justify-between rounded-3xl px-5 py-4 md:px-6 md:py-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-white md:text-3xl">HelpHive</h1>
            <p className="text-sm text-slate-300">
              {title} - Welcome back, {user?.displayName || "Volunteer"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onToggleDuty();
                setDutyRipple((prev) => prev + 1);
              }}
              aria-pressed={onDuty}
              className={`seg-toggle duty-toggle ${onDuty ? "is-on" : "is-off"}`}
            >
              <motion.span
                className="seg-fill"
                animate={{ x: onDuty ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
              <span className={`seg-label left ${!onDuty ? "active" : ""}`}>Off</span>
              <span className={`seg-label right ${onDuty ? "active" : ""}`}>On</span>
              <AnimatePresence>
                <motion.span
                  key={`duty-ripple-${dutyRipple}`}
                  className="toggle-ripple"
                  initial={{ scale: 0.1, opacity: 0.42 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={() => {
                onToggleTheme();
                setThemeRipple((prev) => prev + 1);
              }}
              aria-pressed={isDark}
              className={`seg-toggle theme-toggle ${isDark ? "is-on" : "is-off"}`}
            >
              <motion.span
                className="seg-fill"
                animate={{ x: isDark ? "100%" : "0%" }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
              <span className={`seg-label left ${!isDark ? "active" : ""}`}>Light</span>
              <span className={`seg-label right ${isDark ? "active" : ""}`}>Dark</span>
              <motion.span
                className="theme-icon"
                animate={{ rotate: isDark ? 0 : 180, scale: isDark ? 1 : 0.9 }}
                transition={{ duration: 0.35 }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  {isDark ? (
                    <path d="M20 15.5A8.5 8.5 0 1112.5 4 6.8 6.8 0 0020 15.5z" strokeLinecap="round" strokeLinejoin="round" />
                  ) : (
                    <>
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v2m0 16v2M2 12h2m16 0h2m-3.1-6.9l-1.4 1.4M6.5 17.5l-1.4 1.4m0-13.8l1.4 1.4m11 11l1.4 1.4" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </motion.span>
              <AnimatePresence>
                <motion.span
                  key={`theme-ripple-${themeRipple}`}
                  className="toggle-ripple"
                  initial={{ scale: 0.1, opacity: 0.42 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              </AnimatePresence>
            </button>

            <RotatingGlobe />
          </div>
        </header>

        <AnimatePresence mode="wait" initial={false}>
          <div key={location.pathname} className="fade-up pb-6">
            {children}
          </div>
        </AnimatePresence>
      </main>
    </div>
  );
}
