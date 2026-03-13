import { motion } from 'framer-motion';

const AnimatedButton = ({ children, className = '', ...props }) => (
  <motion.button
    whileHover={{ y: -2, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 px-4 py-2 font-semibold text-white shadow-lg shadow-blue-900/30 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export default AnimatedButton;
