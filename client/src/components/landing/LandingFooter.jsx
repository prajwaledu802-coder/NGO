import { Link } from 'react-router-dom';
import AnimatedLogo from '../common/AnimatedLogo';

export default function LandingFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-[var(--border-muted)] bg-[var(--surface-soft)] py-12">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <AnimatedLogo className="h-8 w-8" />
              <span className="font-['Sora'] text-lg font-bold text-[var(--text-primary)]">
                Help<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Hive</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[var(--text-secondary)]">
              Empowering NGOs globally through smart volunteer, resource, and event coordination.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[var(--text-primary)]">Platform</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#features" className="transition hover:text-[var(--text-primary)]">Features</a></li>
              <li><a href="#how-it-works" className="transition hover:text-[var(--text-primary)]">How It Works</a></li>
              <li><Link to="/login" className="transition hover:text-[var(--text-primary)]">Login</Link></li>
              <li><Link to="/register" className="transition hover:text-[var(--text-primary)]">Register</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-[var(--text-primary)]">Legal</h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li><a href="#" className="transition hover:text-[var(--text-primary)]">Privacy Policy</a></li>
              <li><a href="#" className="transition hover:text-[var(--text-primary)]">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--border-muted)] pt-6 text-center text-sm text-[var(--text-muted)]">
          © {year} HelpHive. All rights reserved. Designed for impact.
        </div>
      </div>
    </footer>
  );
}
