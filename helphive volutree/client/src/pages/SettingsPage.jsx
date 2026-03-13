import { useState } from 'react';
import AnimatedButton from '../components/ui/AnimatedButton';
import PageHeader from '../components/ui/PageHeader';

const SettingsPage = () => {
  const [notifications, setNotifications] = useState(true);

  return (
    <section>
      <PageHeader title="Settings" subtitle="Preferences, notifications, and profile controls" />
      <div className="glass rounded-2xl p-5">
        <label className="mb-4 flex items-center justify-between">
          <span>Enable notifications</span>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="h-4 w-4"
          />
        </label>

        <div className="flex gap-2">
          <AnimatedButton>Save Settings</AnimatedButton>
          <button className="rounded-xl border border-slate-600 px-4 py-2">Edit Profile</button>
        </div>
      </div>
    </section>
  );
};

export default SettingsPage;
