import { motion, useScroll, useSpring } from 'framer-motion';
import { CalendarCheck, PackageSearch, UserPlus } from 'lucide-react';
import { useRef } from 'react';

const steps = [
  {
    title: 'Register Volunteers',
    description: 'Collect skills, contact info and availability — onboard volunteers fast with role-based access.',
    icon: UserPlus,
    gradient: 'from-cyan-500 to-blue-600',
    shadow: 'shadow-cyan-500/20',
  },
  {
    title: 'Add Resources',
    description: 'Track food, medicine and critical supplies. Set low stock alerts and monitor distribution.',
    icon: PackageSearch,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
  },
  {
    title: 'Create Events & Assign',
    description: 'Spin up events and AI-suggest the best volunteers by skills, location and availability.',
    icon: CalendarCheck,
    gradient: 'from-indigo-500 to-purple-600',
    shadow: 'shadow-indigo-500/20',
  },
];

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start center', 'end center'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="how-it-works" ref={containerRef} className="relative overflow-hidden py-24 md:py-40">
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/5 via-indigo-500/5 to-purple-500/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 text-center font-['Sora'] text-4xl font-bold tracking-tight text-[var(--text-primary)] md:text-5xl"
        >
          How{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            HelpHive
          </span>{' '}
          Works
        </motion.h2>

        <div className="relative">
          {/* animated spine */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[3px] overflow-hidden">
            <div className="absolute inset-0 bg-[var(--border-muted)]" />
            <motion.div
              className="absolute top-0 w-full origin-top bg-gradient-to-b from-cyan-400 via-indigo-400 to-purple-500"
              style={{ scaleY: pathLength, height: '100%' }}
            />
          </div>

          <ol className="relative space-y-12 py-4 pl-14">
            {steps.map((step, idx) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-base)] border-2 border-[var(--border-muted)]">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${step.gradient} shadow-lg ${step.shadow}`}>
                    <step.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)] p-6 backdrop-blur-xl"
                >
                  <h3 className="mb-2 font-['Sora'] text-xl font-bold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
