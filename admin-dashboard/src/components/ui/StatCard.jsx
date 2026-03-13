import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 850;
    const start = performance.now();

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setDisplayValue(Math.round(progress * value));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return <>{displayValue.toLocaleString()}</>;
};

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.24, ease: 'easeOut' }}
    whileHover={{ y: -3 }}
    className="tilt-card glass rounded-xl p-5"
  >
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm text-[var(--text-secondary)]">{title}</p>
      <div className={`rounded-xl p-2 ${colorClass}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold tracking-tight">
      <AnimatedNumber value={Number(value) || 0} />
    </p>
  </motion.div>
);

export default StatCard;

