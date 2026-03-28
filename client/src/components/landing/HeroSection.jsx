import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobeScene from '../three/GlobeScene';

const stats = [
  { icon: Users, value: '12,000+', label: 'Volunteers' },
  { icon: Zap, value: '3,400+', label: 'Events' },
  { icon: ShieldCheck, value: '98%', label: 'Uptime' },
];

export default function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32 md:px-12 md:pt-40">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-32 -top-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-32 -right-32 h-[700px] w-[700px] rounded-full bg-gradient-to-br from-cyan-500/20 to-transparent blur-3xl"
        />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border-muted) 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-200"
          >
            <Zap className="h-3.5 w-3.5" />
            Smart Volunteer & Resource Coordination
          </motion.p>

          <h1 className="font-['Sora'] text-4xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl">
            Coordinate{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Volunteers
            </span>{' '}
            &amp; Resources with{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Impact
            </span>
          </h1>

          <p className="mt-5 text-lg text-[var(--text-secondary)] leading-relaxed">
            HelpHive is a full-stack NGO platform for managing volunteers, events, resources,
            and disaster response — with real-time dashboards, map tracking, and AI insights.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <motion.button
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-xl shadow-emerald-900/30"
              >
                Get Started Free <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-xl border border-[var(--border-muted)] bg-[var(--surface-soft)] px-6 py-3 font-semibold text-[var(--text-primary)]"
              >
                Admin Login
              </motion.button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="rounded-lg bg-[var(--surface-soft)] p-1.5">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="font-['Sora'] text-lg font-bold text-[var(--text-primary)]">{value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center justify-center"
        >
          <GlobeScene />
        </motion.div>
      </div>
    </section>
  );
}
