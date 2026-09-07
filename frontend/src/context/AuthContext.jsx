import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (localStorage.getItem('staffline_token')) api.get('/auth/me').then(({ data }) => setUser(data.data.user)).catch(() => localStorage.removeItem('staffline_token')).finally(() => setLoading(false)); else setLoading(false); }, []);
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('staffline_token', data.data.token); setUser(data.data.user); return data; };
  const register = async (payload) => { const { data } = await api.post('/auth/register', payload); localStorage.setItem('staffline_token', data.data.token); setUser(data.data.user); return data; };
  const logout = () => { localStorage.removeItem('staffline_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
