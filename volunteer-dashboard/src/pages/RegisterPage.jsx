import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimatedButton from '../components/ui/AnimatedButton';
import { api } from '../services/api';

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
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/volunteers/register', {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone,
        location: form.location,
        skills: form.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-2xl rounded-2xl p-6"
      >
        <h1 className="mb-5 font-['Sora'] text-2xl font-bold">Create Volunteer Account</h1>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['fullName', 'Full Name'],
            ['email', 'Email'],
            ['password', 'Password'],
            ['phone', 'Phone Number'],
            ['location', 'Location'],
            ['skills', 'Skills'],
            ['volunteerRole', 'Volunteer Role'],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              value={form[name]}
              onChange={onChange}
              type={name === 'password' ? 'password' : 'text'}
              placeholder={label}
              className="rounded-xl border border-slate-600 bg-slate-900/60 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              required={['fullName', 'email', 'password'].includes(name)}
            />
          ))}
        </div>

        {error && <p className="mt-3 text-sm text-rose-300">{error}</p>}

        <AnimatedButton type="submit" className="mt-5 w-full">
          Register
        </AnimatedButton>

        <p className="mt-4 text-center text-sm text-slate-300">
          Already have an account? <Link to="/login" className="text-blue-300">Login</Link>
        </p>
      </motion.form>
    </div>
  );
};

export default RegisterPage;
