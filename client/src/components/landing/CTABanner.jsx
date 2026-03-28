import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-muted)] bg-gradient-to-br from-[var(--surface-soft)] to-[var(--surface-hover)] p-12 text-center shadow-2xl backdrop-blur-xl md:p-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-emerald-500/15 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, delay: 2 }}
            className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[100px]"
          />
          <div className="relative z-10">
            <h2 className="font-['Sora'] text-4xl font-bold leading-tight text-[var(--text-primary)] md:text-5xl">
              Ready to uplevel your NGO operations?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-[var(--text-secondary)]">
              Join hundreds of organizations maximizing their impact with HelpHive.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-8 py-3.5 font-semibold text-white shadow-xl shadow-emerald-900/25"
                >
                  Get Started Now <ArrowRight className="h-4 w-4" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-xl border border-[var(--border-muted)] px-8 py-3.5 font-semibold text-[var(--text-primary)]"
                >
                  Login to Dashboard
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
