import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.18, ease: 'easeInOut' }}
    className={`rounded-xl border border-cyan-300/20 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 px-4 py-2 font-semibold text-white shadow-lg shadow-cyan-900/25 transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;
