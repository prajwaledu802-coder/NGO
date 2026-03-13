import { motion } from "framer-motion";

export default function LoginScreen({ onLogin }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass w-full rounded-3xl p-8 text-center shadow-glow"
      >
        <p className="font-display text-4xl font-bold text-white">HelpHive</p>
        <p className="mx-auto mt-3 max-w-lg text-slate-300">
          Sign in to access your volunteer dashboard, join events, respond to requests,
          and track your real-world impact.
        </p>

        <button
          onClick={onLogin}
          className="mt-8 rounded-2xl bg-emerald-400 px-6 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-emerald-300"
        >
          Continue with Google
        </button>
      </motion.div>
    </div>
  );
}
