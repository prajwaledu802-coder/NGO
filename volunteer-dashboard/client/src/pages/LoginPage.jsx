import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-6"
      >
        <h1 className="mb-5 font-['Sora'] text-2xl font-bold">Welcome Back</h1>
        <div className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

        <AnimatedButton type="submit" className="mt-5 w-full">
          Login
        </AnimatedButton>

        <button
          type="button"
          onClick={() => {
            loginAsDemo();
            navigate('/dashboard');
          }}
          className="mt-3 w-full rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-500/20"
        >
          Continue In Demo Mode
        </button>

        <p className="mt-4 text-center text-sm text-slate-300">
          New here? <Link to="/register" className="text-blue-300">Create account</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginPage;
