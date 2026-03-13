import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin' || roleFromQuery === 'volunteer') {
      setRole(roleFromQuery);
    }
  }, [searchParams]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user?.role !== role) {
        logout();
        setError(`This account is registered as ${user?.role || 'another role'}. Please switch role and try again.`);
        return;
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-bg-primary">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-black/5 bg-white shadow-2xl w-full max-w-md p-8"
      >
        <h1 className="mb-6 font-outfit text-3xl font-bold text-text-primary text-center">Welcome Back</h1>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Sign In As</label>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-black/5 p-1 bg-black/[0.02]">
              <button
                type="button"
                onClick={() => setRole('volunteer')}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  role === 'volunteer' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-black/[0.04]'
                }`}
              >
                Volunteer
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  role === 'admin' ? 'bg-accent-primary text-white' : 'text-text-secondary hover:bg-black/[0.04]'
                }`}
              >
                Admin
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="name@organization.com"
              className="w-full rounded-xl border border-black/5 bg-black/[0.02] px-4 py-3 outline-none focus:ring-2 focus:ring-accent-primary focus:bg-white transition-all"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/5 bg-black/[0.02] px-4 py-3 outline-none focus:ring-2 focus:ring-accent-primary focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>}
        <p className="mt-3 text-center text-xs text-text-tertiary">
          Demo sign-in for Vercel: admin@123 / 2580 and volunteer@123 / 2580
        </p>

        <AnimatedButton type="submit" className="mt-8 w-full !bg-accent-primary shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/30">
          Sign In
        </AnimatedButton>
        <p className="mt-6 text-center text-sm font-medium text-text-tertiary">
          New to HelpHive? <Link to={`/register?role=${role}`} className="text-accent-primary font-bold hover:underline">Create an account</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default LoginPage;
