import { motion } from 'framer-motion';
import { Bell, Menu, Moon, Search, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';

const Topbar = ({ onOpenMobileSidebar, collapsed }) => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const displayName = user?.fullName || 'Coordinator';

  return (
    <header className="mb-5 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-3 shadow-lg backdrop-blur md:mb-6 md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="rounded-lg border border-[var(--border-muted)] p-2 text-[var(--text-secondary)] xl:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--text-muted)]">Smart Volunteer and Resource Coordination Platform</p>
            <p className="font-['Sora'] text-lg font-semibold tracking-tight">Welcome back, {displayName}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 lg:flex lg:w-[320px]">
          <Search className="h-4 w-4 text-[var(--text-muted)]" />
          <input
            placeholder="Search volunteers, events, resources..."
            className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <motion.button
            whileHover={{ y: -2 }}
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            type="button"
            className="rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            aria-label="Alerts"
          >
            <Bell className="h-4 w-4" />
          </motion.button>

          <div className="flex items-center gap-2 rounded-lg border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-1.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-xs font-bold text-slate-950">
              {displayName.slice(0, 1).toUpperCase()}
            </div>
            {!collapsed && <span className="hidden text-sm font-medium md:block">{displayName}</span>}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
