import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlobeScene from '../components/three/GlobeScene';
import AnimatedButton from '../components/ui/AnimatedButton';

const LandingPage = () => (
  <div className="relative min-h-screen overflow-hidden px-6 py-10 md:px-12">
    <div className="absolute inset-0 grid-bg opacity-35" />

    <nav className="glass relative z-10 mx-auto mb-10 flex max-w-6xl items-center justify-between rounded-2xl px-4 py-3">
      <h1 className="font-['Sora'] text-xl font-bold">NGO Nexus</h1>
      <div className="flex gap-3">
        <Link to="/login" className="rounded-lg border border-slate-600 px-4 py-2 text-sm">
          Login
        </Link>
        <Link to="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold">
          Register
        </Link>
      </div>
    </nav>

    <section className="relative z-10 mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/40 px-3 py-1 text-xs text-indigo-200">
          <Sparkles className="h-3.5 w-3.5" /> Premium MERN Platform
        </p>
        <h2 className="font-['Sora'] text-4xl font-bold leading-tight md:text-5xl">
          Empowering NGOs Through Smart Volunteer Coordination
        </h2>
        <p className="mt-4 text-slate-300">
          Manage volunteers, resources, events, and impact analytics from one beautiful control center.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/register">
            <AnimatedButton className="flex items-center gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </AnimatedButton>
          </Link>
          <Link to="/dashboard" className="rounded-xl border border-slate-500 px-4 py-2 font-semibold">
            Explore Platform
          </Link>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
        <GlobeScene />
      </motion.div>
    </section>
  </div>
);

export default LandingPage;
