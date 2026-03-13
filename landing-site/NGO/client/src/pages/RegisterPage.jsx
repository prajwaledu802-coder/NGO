import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: '',
    skills: '',
    volunteerRole: '',
  });
  const [role, setRole] = useState('volunteer');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roleFromQuery = searchParams.get('role');
    if (roleFromQuery === 'admin' || roleFromQuery === 'volunteer') {
      setRole(roleFromQuery);
    }
  }, [searchParams]);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: form.location,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        role,
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-bg-primary">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-black/5 bg-white shadow-2xl w-full max-w-2xl p-8"
      >
        <h1 className="mb-8 font-outfit text-3xl font-bold text-text-primary text-center">Join the Mission</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">Create Account As</label>
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

          {[
            ['fullName', 'Full Name', 'text', 'John Doe'],
            ['email', 'Email Address', 'email', 'name@example.com'],
            ['password', 'Secure Password', 'password', '••••••••'],
            ['phone', 'Phone Number', 'text', '+1 (555) 000-0000'],
            ['location', 'Current Location', 'text', 'City, Country'],
            ['skills', 'Key Skills', 'text', 'Medical, Logistics, etc.'],
            ['volunteerRole', 'Preferred Role', 'text', 'Crisis Responder'],
          ].map(([name, label, type, placeholder]) => (
            <div key={name} className="space-y-1">
              <label className="text-xs font-bold text-text-tertiary uppercase tracking-wider ml-1">{label}</label>
              <input
                name={name}
                value={form[name]}
                onChange={onChange}
                type={type}
                placeholder={placeholder}
                className="w-full rounded-xl border border-black/5 bg-black/[0.02] px-4 py-3 outline-none focus:ring-2 focus:ring-accent-primary focus:bg-white transition-all overflow-hidden"
                required={['fullName', 'email', 'password'].includes(name)}
              />
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-500 font-medium text-center">{error}</p>}

        <AnimatedButton type="submit" className="mt-8 w-full !bg-accent-primary shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/30">
          Create My Account
        </AnimatedButton>

        <p className="mt-6 text-center text-sm font-medium text-text-tertiary">
          Already part of HelpHive? <Link to={`/login?role=${role}`} className="text-accent-primary font-bold hover:underline">Sign In</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterPage;
