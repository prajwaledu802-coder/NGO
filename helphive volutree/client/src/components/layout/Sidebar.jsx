import { motion } from 'framer-motion';
import {
  BarChart3,
  CalendarDays,
  Gauge,
  Globe,
  Medal,
  Package,
  Settings,
  User,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: Gauge },
  { to: '/volunteers', label: 'Volunteers', icon: Users },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/resources', label: 'Resources', icon: Package },
  { to: '/map', label: 'Map Tracking', icon: Globe },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Medal },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/profile', label: 'Profile', icon: User },
];

const Sidebar = () => (
  <aside className="glass hidden min-h-screen w-72 border-r border-slate-800/50 p-4 lg:block">
    <motion.h2
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-8 font-['Sora'] text-xl font-bold"
    >
      NGO Nexus
    </motion.h2>

    <nav className="space-y-2">
      {links.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
              isActive
                ? 'bg-gradient-to-r from-blue-700/70 to-indigo-700/70 text-white'
                : 'text-slate-300 hover:bg-slate-800/40'
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
