import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const OFFLINE_USER_KEY = 'ngo_offline_user';
const demoCredentials = {
  admin: { email: 'admin@helphive.org', password: 'Admin@123' },
  volunteer: { email: 'aarav@example.com', password: 'Volunteer@123' },
};

const offlineRoleUsers = {
  admin: {
    id: 'offline-admin',
    _id: 'offline-admin',
    name: 'HelpHive Admin',
    fullName: 'HelpHive Admin',
    email: 'admin@helphive.org',
    role: 'admin',
    status: 'approved',
  },
  volunteer: {
    id: 'offline-volunteer',
    _id: 'offline-volunteer',
    name: 'HelpHive Volunteer',
    fullName: 'HelpHive Volunteer',
    email: 'aarav@example.com',
    role: 'volunteer',
    status: 'approved',
    dutyStatus: 'off-duty',
  },
};

const readOfflineUser = () => {
  try {
    const raw = localStorage.getItem(OFFLINE_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(
    () => Boolean(localStorage.getItem('ngo_token')) || Boolean(readOfflineUser())
  );

  useEffect(() => {
    const token = localStorage.getItem('ngo_token');
    if (!token) {
      const offlineUser = readOfflineUser();
      setUser(offlineUser);
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        localStorage.removeItem(OFFLINE_USER_KEY);
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem('ngo_token');
        const offlineUser = readOfflineUser();
        setUser(offlineUser);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.removeItem(OFFLINE_USER_KEY);
    localStorage.setItem('ngo_token', data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.removeItem(OFFLINE_USER_KEY);
    localStorage.setItem('ngo_token', data.token);
    setUser(data.user);
  };

  const loginOfflineByRole = (role) => {
    const fallbackUser = offlineRoleUsers[role];
    if (!fallbackUser) {
      throw new Error('Invalid role');
    }

    localStorage.removeItem('ngo_token');
    localStorage.setItem(OFFLINE_USER_KEY, JSON.stringify(fallbackUser));
    setUser(fallbackUser);
  };

  const loginAsRole = async (role) => {
    const creds = demoCredentials[role];
    if (!creds) {
      throw new Error('Invalid role');
    }

    try {
      await login(creds.email, creds.password);
    } catch (error) {
      const status = error?.response?.status;
      if (!status || status >= 500 || status === 401 || status === 403) {
        loginOfflineByRole(role);
        return;
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('ngo_token');
    localStorage.removeItem(OFFLINE_USER_KEY);
    setUser(null);
  };

  const switchRole = async () => {
    const nextRole = user?.role === 'admin' ? 'volunteer' : 'admin';
    await loginAsRole(nextRole);
    return nextRole;
  };

  const value = useMemo(
    () => ({ user, loading, login, register, loginAsRole, switchRole, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
