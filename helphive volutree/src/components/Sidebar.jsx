import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

const links = [
  ["/dashboard", "Dashboard", "M3 4h18v4H3zM3 10h10v10H3zM15 10h6v10h-6z"],
  ["/events", "Available Events", "M4 6h16v14H4zM4 10h16M9 3v6M15 3v6"],
  ["/activities", "My Activities", "M5 18h14M7 15h10M9 12h6M11 9h2"],
  ["/requests", "Nearby Help Requests", "M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z"],
  ["/map", "Volunteer Map", "M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"],
  ["/impact", "Impact Score", "M4 19h16M7 16V9m5 7V5m5 11v-4"],
  ["/certificates", "Certificates", "M5 4h14v16H5zM8 8h8M8 12h8"],
  ["/notifications", "Notifications", "M12 3a4 4 0 00-4 4v2c0 1.7-.7 3.4-2 4.6h12c-1.3-1.2-2-2.9-2-4.6V7a4 4 0 00-4-4zM10 19a2 2 0 004 0"],
  ["/profile", "Profile", "M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0"]
];

function HoneycombIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M7 3l5-2 5 2v6l-5 3-5-3V3z" />
      <path d="M2 11l5-2 5 2v6l-5 3-5-3v-6z" />
      <path d="M12 11l5-2 5 2v6l-5 3-5-3v-6z" />
    </svg>
  );
}

function iconAnimation(label) {
  if (label === "Dashboard") {
    return {
      animate: { scale: [1, 1.05, 1] },
      transition: { duration: 2.2, repeat: Number.POSITIVE_INFINITY }
    };
  }

  if (label === "Notifications") {
    return {
      animate: { y: [0, -1.4, 0] },
      transition: { duration: 1.6, repeat: Number.POSITIVE_INFINITY }
    };
  }

  if (label === "My Activities") {
    return {
      animate: { rotate: [0, -4, 0] },
      transition: { duration: 2.4, repeat: Number.POSITIVE_INFINITY }
    };
  }

  return { animate: {}, transition: { duration: 0 } };
}

function NavIcon({ path, label }) {
  const anim = iconAnimation(label);
  return (
    <motion.svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      animate={anim.animate}
      transition={anim.transition}
    >
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}

export default function Sidebar({ collapsed, onToggleCollapse }) {
  return (
    <aside className="glass h-full rounded-3xl border-white/10 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 px-2 pb-4 pt-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <HoneycombIcon className="h-7 w-7 text-[var(--primary)]" />
          {!collapsed && (
            <div>
              <p className="font-display text-xl font-bold text-white">HelpHive</p>
              <p className="text-xs text-slate-400">Volunteer Command Center</p>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="collapse-toggle hidden md:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.24 }}>
            {"<"}
          </motion.span>
        </button>
      </div>

      <nav className="space-y-1">
        {links.map(([to, label, iconPath], idx) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
          >
            {({ isActive }) => (
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ x: 2 }}
              >
                <motion.span className="nav-icon-shell" whileHover={{ scale: 1.08 }}>
                  <NavIcon path={iconPath} label={label} />
                </motion.span>
                {!collapsed && <span>{label}</span>}
                {isActive && <span className="active-pill" />}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
