import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AnimatedLogo from '../common/AnimatedLogo';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
];

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-4 py-3' : 'px-6 py-6'}`}
    >
      <div
        className={`mx-auto flex w-full max-w-7xl items-center justify-between transition-all duration-300 ${
          isScrolled
            ? 'rounded-full border border-[var(--border-muted)] bg-[var(--surface-soft)]/90 px-6 py-3 shadow-xl backdrop-blur-2xl'
            : 'rounded-none border-transparent bg-transparent px-2 py-2'
        }`}
      >
        <Link to="/" className="group flex cursor-pointer items-center gap-2">
          <AnimatedLogo className="h-10 w-10" />
          <span className="font-['Sora'] text-xl font-bold tracking-tight text-[var(--text-primary)]">
            Help<span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Hive</span>
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className="group relative text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-0 rounded-full bg-emerald-400 transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/login" className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            Login
          </Link>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25"
            >
              Get Started
            </Link>
          </motion.div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] md:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 right-4 top-[calc(100%+0.5rem)] mt-2 flex origin-top flex-col gap-2 rounded-2xl border border-[var(--border-muted)] bg-[var(--surface-soft)]/95 p-4 shadow-2xl backdrop-blur-3xl md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-lg px-4 py-3 text-base font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
              >
                {link.name}
              </motion.a>
            ))}
            <div className="my-2 h-px w-full bg-[var(--border-muted)]" />
            <div className="flex flex-col gap-3 px-2 pb-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-center text-base font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]">
                Login
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2.5 text-center text-base font-semibold text-white">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
