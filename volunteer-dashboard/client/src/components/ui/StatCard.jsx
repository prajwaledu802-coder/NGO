import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    className="glass rounded-2xl p-5"
  >
    <div className="mb-3 flex items-center justify-between">
      <p className="text-sm text-slate-300">{title}</p>
      <div className={`rounded-xl p-2 ${colorClass}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </motion.div>
);

export default StatCard;
