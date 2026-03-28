import { useEffect, useState } from 'react';
import TiltCard from '../components/ui/TiltCard';
import { useAuth } from '../context/AuthContext';

export default function CertificatesPage() {
  const { user, token } = useAuth();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/volunteer/certificate', { headers })
      .then((r) => r.json())
      .then((data) => {
        if (active) setCert(data);
      })
      .catch(() => {
        if (active)
          setCert({
            volunteerName: user?.name || 'Volunteer',
            totalHours: user?.hoursContributed || 0,
            eventsCompleted: user?.eventsJoined || 0,
          });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user, token]);

  const download = () => {
    import('html2pdf.js').then(({ default: html2pdf }) => {
      const el = document.getElementById('cert-preview');
      html2pdf().set({ margin: 0, filename: 'helphive-certificate.pdf', image: { type: 'jpeg', quality: 0.98 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' } }).from(el).save();
    });
  };

  if (loading) {
    return <div className="flex h-64 items-center justify-center text-[var(--text-muted)]">Loading certificate…</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <TiltCard className="max-w-2xl">
        <h3 className="font-['Sora'] text-2xl font-bold text-[var(--text-primary)]">Your Certificate</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">Volunteer name: {cert?.volunteerName}</p>
        <p className="text-sm text-[var(--text-secondary)]">Total hours: {cert?.totalHours}</p>
        <p className="text-sm text-[var(--text-secondary)]">Events completed: {cert?.eventsCompleted}</p>
        <button
          type="button"
          onClick={download}
          className="mt-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-lg"
        >
          Download Certificate PDF
        </button>
      </TiltCard>

      {/* Hidden certificate preview used by html2pdf */}
      <div id="cert-preview" className="pointer-events-none fixed left-[-9999px] top-0 h-[297mm] w-[420mm] bg-[#0b1a2e] p-16 text-white">
        <div className="flex h-full flex-col items-center justify-center rounded-3xl border-4 border-amber-400/40 p-12 text-center">
          <p className="text-2xl font-semibold text-amber-300 uppercase tracking-widest">HelpHive</p>
          <h1 className="mt-4 text-5xl font-bold">Certificate of Appreciation</h1>
          <p className="mt-8 text-xl text-slate-300">This is to certify that</p>
          <p className="mt-3 text-4xl font-bold text-emerald-400">{cert?.volunteerName}</p>
          <p className="mt-6 text-lg text-slate-300">has contributed <strong className="text-white">{cert?.totalHours} hours</strong> across <strong className="text-white">{cert?.eventsCompleted} events</strong></p>
          <p className="mt-4 text-base text-slate-400">For outstanding community service through the HelpHive platform.</p>
          <div className="mt-10 text-sm text-slate-500">HelpHive — Smart Volunteer &amp; Resource Coordination Platform</div>
        </div>
      </div>
    </div>
  );
}
