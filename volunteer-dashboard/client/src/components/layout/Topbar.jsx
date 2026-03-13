import { Bell, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Topbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Volunteer Command Center</p>
        <p className="font-semibold">Welcome, {user?.fullName || 'Coordinator'}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg bg-slate-800/60 p-2 hover:bg-slate-700/70"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <button className="rounded-lg bg-slate-800/60 p-2 hover:bg-slate-700/70" aria-label="Alerts">
          <Bell className="h-4 w-4" />
        </button>
        <button
          onClick={logout}
          className="rounded-lg bg-rose-900/50 p-2 text-rose-200 hover:bg-rose-800/60"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
