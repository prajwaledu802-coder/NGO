import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Globe,
  Heart,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';

const ADMIN_URL = import.meta.env.VITE_ADMIN_DASHBOARD_URL || 'http://localhost:5174';
const VOLUNTEER_URL = import.meta.env.VITE_VOLUNTEER_DASHBOARD_URL || 'http://localhost:5175';

const navLinks = ['Home', 'Features', 'Impact', 'About', 'Contact'];

const features = [
  {
    icon: Users,
    title: 'Volunteer Management',
    desc: 'Assign, track, and coordinate volunteers across multiple disaster zones with real-time updates.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: MapPin,
    title: 'Live Map Tracking',
    desc: 'Monitor volunteer positions, disaster locations, and resource centers on an interactive OpenStreetMap.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Impact Analytics',
    desc: 'Visualize volunteer hours, resources deployed, and disaster response metrics with rich charts.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    desc: 'Send real-time alerts and assignments to volunteers via socket-powered notifications.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Resource Coordination',
    desc: 'Manage and distribute critical resources like food, medicine, and shelter across operations.',
    color: 'from-rose-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Insights',
    desc: 'Leverage Groq AI to generate volunteer insights, predict needs, and optimize deployments.',
    color: 'from-indigo-500 to-blue-500',
  },
];

const impactStats = [
  { label: 'Volunteers Coordinated', value: '12,400+', icon: Users },
  { label: 'Disaster Events Managed', value: '340+', icon: Activity },
  { label: 'Resources Distributed', value: '98,000+', icon: Target },
  { label: 'Lives Impacted', value: '250,000+', icon: Heart },
];

const teamMembers = [
  { name: 'Admin Portal', role: 'For NGO Administrators', icon: LayoutDashboard, color: 'from-amber-400 to-orange-500' },
  { name: 'Volunteer Portal', role: 'For Field Volunteers', icon: Shield, color: 'from-emerald-400 to-teal-500' },
];

const LandingPage = () => {
  return (
    <div className="gradient-bg min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0f1e]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-slate-900">
              H
            </div>
            <span className="font-sora text-xl font-bold text-white">HelpHive</span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-slate-400 transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={ADMIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition hover:bg-amber-500/20 sm:block"
            >
              Admin Portal
            </a>
            <a
              href={VOLUNTEER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Volunteer Portal
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden px-6 py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute right-1/4 top-2/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300">
              <Sparkles className="h-3.5 w-3.5" />
              Smart NGO Coordination Platform
            </span>

            <h1 className="font-sora mb-6 text-4xl font-extrabold leading-tight text-white md:text-6xl lg:text-7xl">
              Coordinate. Respond.{' '}
              <span className="gradient-text">Save Lives.</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400">
              HelpHive connects NGO administrators and field volunteers for real-time disaster response, resource management, and community impact at scale.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition sm:w-auto"
              >
                <LayoutDashboard className="h-5 w-5" />
                Admin Portal
                <ArrowRight className="h-4 w-4" />
              </motion.a>

              <motion.a
                href={VOLUNTEER_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition sm:w-auto"
              >
                <Shield className="h-5 w-5" />
                Volunteer Portal
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-sora mb-4 text-3xl font-bold text-white md:text-4xl">
              Powerful Features for{' '}
              <span className="gradient-text">Modern NGOs</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-400">
              Everything you need to coordinate disaster relief operations at scale.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="card-glass group rounded-2xl p-6 transition-all hover:border-white/15"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3`}>
                  <feature.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mb-2 font-sora text-base font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="font-sora mb-4 text-3xl font-bold text-white md:text-4xl">
              Real-World <span className="gradient-text">Impact</span>
            </h2>
            <p className="mx-auto max-w-xl text-slate-400">
              HelpHive has powered some of the most effective disaster relief operations globally.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {impactStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-glass rounded-2xl p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
                  <stat.icon className="h-6 w-6 text-amber-400" />
                </div>
                <div className="font-sora mb-1 text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-sora mb-6 text-3xl font-bold text-white md:text-4xl">
                About <span className="gradient-text">HelpHive</span>
              </h2>
              <p className="mb-4 text-slate-400">
                HelpHive is a full-stack MERN platform built to empower NGO administrators and field volunteers during disaster relief operations. Built with React, Node.js, MongoDB, and cutting-edge AI integrations.
              </p>
              <p className="mb-6 text-slate-400">
                Our platform bridges the gap between command centers and ground-level responders through real-time communication, intelligent analytics, and seamless resource coordination.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.name} className="card-glass rounded-xl p-4">
                    <div className={`mb-2 inline-flex rounded-lg bg-gradient-to-br ${member.color} p-2`}>
                      <member.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="font-sora text-sm font-semibold text-white">{member.name}</div>
                    <div className="text-xs text-slate-500">{member.role}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-glass rounded-2xl p-8"
            >
              <h3 className="font-sora mb-6 text-xl font-bold text-white">Tech Stack</h3>
              {[
                { name: 'React + Vite + Tailwind CSS', desc: 'Modern, responsive frontend', pct: 90 },
                { name: 'Node.js + Express', desc: 'Robust RESTful backend', pct: 85 },
                { name: 'MongoDB Atlas', desc: 'Scalable cloud database', pct: 80 },
                { name: 'Socket.io', desc: 'Real-time communication', pct: 75 },
                { name: 'Groq AI + Leaflet Maps', desc: 'Intelligence & visualization', pct: 70 },
              ].map((tech) => (
                <div key={tech.name} className="mb-4">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-white">{tech.name}</span>
                    <span className="text-slate-500">{tech.desc}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${tech.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sora mb-4 text-3xl font-bold text-white md:text-4xl">
              Get in <span className="gradient-text">Touch</span>
            </h2>
            <p className="mb-10 text-slate-400">
              Ready to transform your NGO's disaster response capability? Reach out to us.
            </p>

            <div className="mb-10 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Mail, label: 'Email', value: 'hello@helphive.io' },
                { icon: Phone, label: 'Phone', value: '+1 (800) HELP-HIVE' },
                { icon: MessageCircle, label: 'Chat', value: 'Live Support' },
              ].map((item) => (
                <div key={item.label} className="card-glass rounded-xl p-4">
                  <item.icon className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                  <div className="text-sm font-semibold text-white">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href={ADMIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-4 font-bold text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                Admin Portal
              </motion.a>
              <motion.a
                href={VOLUNTEER_URL}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 font-bold text-white"
              >
                <Shield className="h-5 w-5" />
                Volunteer Portal
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-slate-900">
              H
            </div>
            <span className="font-sora font-semibold text-white">HelpHive</span>
            <span>— Smart Volunteer & Resource Coordination</span>
          </div>
          <div>© {new Date().getFullYear()} HelpHive. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
