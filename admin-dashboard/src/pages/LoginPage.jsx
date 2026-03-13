import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, loginAsRole, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.role) return;
    navigate(user.role === 'admin' ? '/dashboard' : '/volunteer-dashboard', { replace: true });
  }, [user, navigate]);

  const handleRoleLogin = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      await loginAsRole(role);
    } catch (err) {
      setError(err.response?.data?.message || 'Role login failed. Ensure seed users exist in backend.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your email and password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-md rounded-2xl p-6 flex flex-col items-center"
      >
        <h1 className="mb-8 font-['Sora'] text-2xl font-bold text-center">HelpHive Login</h1>

        <div className="w-full space-y-3 mb-5">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-[var(--border-muted)] bg-[var(--card-elevated)] px-3 py-2 text-sm outline-none"
          />
        </div>

        {error ? <p className="mb-3 text-center text-xs text-rose-300">{error}</p> : null}

        <div className="w-full space-y-4">
          <AnimatedButton type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </AnimatedButton>

          <div className="grid grid-cols-2 gap-3">
            <AnimatedButton
              type="button"
              onClick={() => handleRoleLogin('admin')}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={submitting}
            >
              Quick Admin
            </AnimatedButton>
            <AnimatedButton
              type="button"
              onClick={() => handleRoleLogin('volunteer')}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={submitting}
            >
              Quick Volunteer
            </AnimatedButton>
          </div>

          <p className="pt-1 text-center text-xs text-[var(--text-muted)]">
            Demo credentials: admin@123 / 2580 and volunteer@123 / 2580.
          </p>
          <p className="text-center text-xs text-[var(--text-secondary)]">
            New volunteer? <Link to="/register" className="font-semibold text-[var(--text-primary)]">Register here</Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
};

export default LoginPage;
