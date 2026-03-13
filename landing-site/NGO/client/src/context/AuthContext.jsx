import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const DEMO_USER_KEY = 'ngo_demo_user';
const demoCredentials = {
  admin: { email: 'admin@123', password: '2580' },
  volunteer: { email: 'volunteer@123', password: '2580' },
};
const demoUsersByRole = {
  admin: {
    _id: 'demo-admin',
    id: 'demo-admin',
    fullName: 'HelpHive Admin',
    email: 'admin@123',
    role: 'admin',
    status: 'approved',
  },
  volunteer: {
    _id: 'demo-volunteer',
    id: 'demo-volunteer',
    fullName: 'HelpHive Volunteer',
    email: 'volunteer@123',
    role: 'volunteer',
    status: 'approved',
  },
};

const readDemoUser = () => {
  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(DEMO_USER_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readDemoUser());
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem('ngo_token')) || Boolean(readDemoUser())
  );

  useEffect(() => {
    const token = localStorage.getItem('ngo_token');
    if (!token) {
      setUser(readDemoUser());
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        localStorage.removeItem(DEMO_USER_KEY);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('ngo_token');
        setUser(readDemoUser());
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (
      normalizedEmail === demoCredentials.admin.email &&
      normalizedPassword === demoCredentials.admin.password
    ) {
      return loginDemoByRole('admin');
    }
    if (
      normalizedEmail === demoCredentials.volunteer.email &&
      normalizedPassword === demoCredentials.volunteer.password
    ) {
      return loginDemoByRole('volunteer');
    }

    const { data } = await api.post('/auth/login', { email: normalizedEmail, password });
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.setItem('ngo_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.setItem('ngo_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const loginDemoByRole = (role) => {
    const demoUser = demoUsersByRole[role];
    if (!demoUser) {
      throw new Error('Invalid role');
    }

    localStorage.removeItem('ngo_token');
    localStorage.setItem(DEMO_USER_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setLoading(false);
    return demoUser;
  };

  const logout = () => {
    localStorage.removeItem('ngo_token');
    localStorage.removeItem(DEMO_USER_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
