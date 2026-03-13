import { useState } from "react";
import { motion } from "framer-motion";

export default function TiltCard({ children, className = "", delay = 0 }) {
  const [style, setStyle] = useState({});

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -7;
    const ry = ((x / rect.width) - 0.5) * 8;
    setStyle({ transform: `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.02, 1.02, 1.02)` });
  };

  return (
    <motion.div
      className={`card-tilt card-lift rounded-2xl glass p-5 shadow-glow ${className}`}
      style={style}
      onMouseMove={onMove}
      onMouseLeave={() => setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)" })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -3 }}
      transition={{ duration: 0.45, delay }}
    >
      {children}
    </motion.div>
  );
}
