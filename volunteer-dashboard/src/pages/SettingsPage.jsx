import { useMemo, useState } from 'react';
import { BellRing, Moon, Sun } from 'lucide-react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';
import { StaggerItem, StaggerSection } from '../components/ui/StaggerSection';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const initialProfile = useMemo(
    () => ({
      fullName: user?.fullName || user?.name || '',
      email: user?.email || '',
      skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
    }),
    [user?.email, user?.fullName, user?.name, user?.skills]
  );
  const [profileForm, setProfileForm] = useState(initialProfile);

  return (
    <section className="space-y-5 pb-10 md:space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Theme, notifications, and profile preferences applied globally"
      />

      <StaggerSection className="grid gap-4 lg:grid-cols-2">
        <StaggerItem className="glass rounded-xl p-5">
          <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Theme</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`h-11 rounded-xl border px-3 text-sm ${
                theme === 'dark'
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
                  : 'border-[var(--border-muted)] text-[var(--text-secondary)]'
              }`}
            >
              <Moon className="mr-1 inline h-4 w-4" /> Dark mode
            </button>
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`h-11 rounded-xl border px-3 text-sm ${
                theme === 'light'
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200'
                  : 'border-[var(--border-muted)] text-[var(--text-secondary)]'
              }`}
            >
              <Sun className="mr-1 inline h-4 w-4" /> Light mode
            </button>
          </div>

          <label className="mt-5 flex h-11 items-center justify-between rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3">
            <span className="text-sm">
              <BellRing className="mr-1 inline h-4 w-4" /> Enable notifications
            </span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-4 w-4"
            />
          </label>
        </StaggerItem>

        <StaggerItem className="glass rounded-xl p-5">
          <h3 className="mb-3 font-['Outfit'] text-lg font-semibold">Profile Edit Form</h3>
          <div className="space-y-2">
            <input
              value={profileForm.fullName}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, fullName: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
              placeholder="Full name"
            />
            <input
              value={profileForm.email}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
              placeholder="Email"
            />
            <textarea
              value={profileForm.skills}
              onChange={(e) => setProfileForm((prev) => ({ ...prev, skills: e.target.value }))}
              className="min-h-24 w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
              placeholder="Skills"
            />
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setProfileForm(initialProfile)}
              className="rounded-xl border border-[var(--border-muted)] px-4 py-2 text-sm"
            >
              Reset
            </button>
            <AnimatedButton>Save Settings</AnimatedButton>
          </div>
        </StaggerItem>
      </StaggerSection>
    </section>
  );
};

export default SettingsPage;

