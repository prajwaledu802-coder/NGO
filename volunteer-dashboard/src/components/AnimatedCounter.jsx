import { useEffect, useState } from "react";

export default function AnimatedCounter({ to, suffix = "", duration = 1200 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * to));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, duration]);

  return (
    <span className="text-3xl font-display font-bold text-white">
      {value}
      {suffix}
    </span>
  );
}
