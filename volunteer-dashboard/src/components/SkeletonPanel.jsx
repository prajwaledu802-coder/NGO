import { motion } from "framer-motion";

export default function SkeletonPanel({ className = "" }) {
  return (
    <motion.div
      className={`skeleton-panel rounded-2xl ${className}`}
      initial={{ opacity: 0.45 }}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.4 }}
    />
  );
}
