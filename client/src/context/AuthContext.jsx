import { createContext, useContext, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { getStoredUser, setSession, clearSession } from '../api/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const register = async ({ email, password, confirmPassword }) => {
    const { data } = await axiosClient.post('/auth/register', {
      email,
      password,
      confirmPassword,
    });
    return data.user;
  };

  const login = async ({ email, password }) => {
    const { data } = await axiosClient.post('/auth/login', { email, password });
    setSession(data);
    setUser(data.user);
    return data.user;
  };

  const adminLogin = async ({ email, password }) => {
    const { data } = await axiosClient.post('/auth/admin/login', { email, password });
    setSession(data);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, register, login, adminLogin, logout }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
