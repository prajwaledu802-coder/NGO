import { motion } from 'framer-motion';

const PageHeader = ({ title, subtitle, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-6 flex flex-wrap items-center justify-between gap-3"
  >
    <div>
      <h1 className="font-['Sora'] text-2xl font-bold md:text-3xl">{title}</h1>
      <p className="text-sm text-slate-300">{subtitle}</p>
    </div>
    {action}
  </motion.div>
);

export default PageHeader;
