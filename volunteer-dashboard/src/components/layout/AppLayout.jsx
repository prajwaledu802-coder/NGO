import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ChatbotWidget from '../chatbot/ChatbotWidget';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout = () => {
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const routeNames = {
      '/': 'Dashboard',
      '/dashboard': 'Dashboard',
      '/admin-dashboard': 'Admin Dashboard',
      '/volunteer-dashboard': 'Volunteer Dashboard',
      '/volunteers': 'Volunteers',
      '/events': 'Events',
      '/resources': 'Resources',
      '/map-tracking': 'Map Tracking',
      '/map': 'Map Tracking',
      '/analytics': 'Analytics',
      '/leaderboard': 'Leaderboard',
      '/ai': 'AI Insights',
      '/settings': 'Settings',
      '/profile': 'Profile',
    };

    const current = routeNames[location.pathname] || 'Platform';
    document.title = `HelpHive | ${current}`;
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="ambient-bg" />
      </div>

      <Sidebar
        collapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <main className="h-screen w-full overflow-y-auto px-4 pb-6 pt-4 md:px-6 md:pb-8 md:pt-5">
        <Topbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          collapsed={isSidebarCollapsed}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
            className="mx-auto w-full max-w-[1320px]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <ChatbotWidget />
    </div>
  );
};

export default AppLayout;
