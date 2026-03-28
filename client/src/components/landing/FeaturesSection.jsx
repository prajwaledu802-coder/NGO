import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { BarChart3, Calendar, Compass, Cpu, Package, Users } from 'lucide-react';

const features = [
  {
    title: 'Volunteer Management',
    description: 'Track volunteers, skills and availability. Mobilize the right people for the right tasks instantly with smart matching.',
    icon: Users,
    color: 'text-cyan-400',
    gradient: 'from-cyan-500/20 to-transparent',
    border: 'group-hover:border-cyan-400/30',
    shadow: 'group-hover:shadow-cyan-500/15',
  },
  {
    title: 'Resource Inventory',
    description: 'Manage food, medicines and supplies in real time. Prevent shortages with automated low-stock alerts across crisis zones.',
    icon: Package,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-transparent',
    border: 'group-hover:border-purple-400/30',
    shadow: 'group-hover:shadow-purple-500/15',
  },
  {
    title: 'Event Coordination',
    description: 'Create events and assign volunteers. Orchestrate every detail from local food drives to large-scale disaster responses.',
    icon: Calendar,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-transparent',
    border: 'group-hover:border-blue-400/30',
    shadow: 'group-hover:shadow-blue-500/15',
  },
  {
    title: 'Map Tracking',
    description: 'Monitor volunteers, events, and disaster alerts on an interactive live map powered by OpenStreetMap and Leaflet.',
    icon: Compass,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-transparent',
    border: 'group-hover:border-emerald-400/30',
    shadow: 'group-hover:shadow-emerald-500/15',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Understand your impact with real-time charts — volunteer activity trends, resource usage, and event performance.',
    icon: BarChart3,
    color: 'text-amber-400',
    gradient: 'from-amber-500/20 to-transparent',
    border: 'group-hover:border-amber-400/30',
    shadow: 'group-hover:shadow-amber-500/15',
  },
  {
    title: 'AI Insights',
    description: 'AI-powered recommendations for volunteer-event matching, resource allocation, and disaster response efficiency.',
    icon: Cpu,
    color: 'text-rose-400',
    gradient: 'from-rose-500/20 to-transparent',
    border: 'group-hover:border-rose-400/30',
    shadow: 'group-hover:shadow-rose-500/15',
  },
];

function FeatureCard({ feature }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(useSpring(y), [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(useSpring(x), [-0.5, 0.5], ['-8deg', '8deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`group relative flex flex-col rounded-3xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/80 p-8 backdrop-blur-xl transition-shadow duration-300 ${feature.border} ${feature.shadow} hover:shadow-2xl cursor-pointer`}
    >
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div style={{ transform: 'translateZ(30px)' }} className="relative z-10">
        <div className="mb-5 inline-flex rounded-2xl border border-[var(--border-muted)] bg-[var(--card-elevated)] p-4">
          <feature.icon className={`h-6 w-6 ${feature.color}`} />
        </div>
        <h3 className="mb-3 font-['Sora'] text-xl font-bold text-[var(--text-primary)]">{feature.title}</h3>
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{feature.description}</p>
      </div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="relative overflow-hidden py-24 md:py-32">
      <div className="pointer-events-none absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[600px] w-[600px] rounded-full bg-cyan-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-['Sora'] text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl">
            Powerful Tools for{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Modern NGOs
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-secondary)]">
            A complete operating system for impact. Streamline operations, manage resources,
            and mobilize volunteers from one intelligent platform.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
