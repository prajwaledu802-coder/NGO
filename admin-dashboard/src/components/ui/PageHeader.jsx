import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.24, ease: 'easeOut' }}
    className="mb-5 flex flex-wrap items-start justify-between gap-3 md:mb-6"
  >
    <div>
      <h1 className="font-['Outfit'] text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
    </div>
    {action ? <div className="flex items-center gap-2">{action}</div> : null}
  </motion.div>
);

export default PageHeader;
