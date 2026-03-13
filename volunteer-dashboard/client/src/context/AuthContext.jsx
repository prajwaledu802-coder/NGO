import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const DEMO_KEY = 'ngo_demo_user';
const demoCredentials = { email: 'volunteer@123', password: '2580' };

const getStoredDemoUser = () => {
  const raw = localStorage.getItem(DEMO_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(DEMO_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredDemoUser());
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('ngo_token')));

  useEffect(() => {
    const token = localStorage.getItem('ngo_token');
    if (!token) return;

    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem('ngo_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    if (email === demoCredentials.email && password === demoCredentials.password) {
      loginAsDemo();
      return;
    }

    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ngo_token', data.token);
    localStorage.removeItem(DEMO_KEY);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('ngo_token', data.token);
    localStorage.removeItem(DEMO_KEY);
    setUser(data.user);
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 'demo-user',
      fullName: 'Demo Coordinator',
      email: 'demo@ngo.local',
      role: 'coordinator',
    };

    localStorage.removeItem('ngo_token');
    localStorage.setItem(DEMO_KEY, JSON.stringify(demoUser));
    setUser(demoUser);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('ngo_token');
    localStorage.removeItem(DEMO_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, loginAsDemo, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
