import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            const response = await authAPI.getMe();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
          } catch {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Storage access restricted during initialization:', err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password });
    const { access_token, refresh_token, user: userData } = response.data;
    try {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Could not persist auth to localStorage:', err);
    }
    setUser(userData);
    return userData;
  };

  const register = async (data) => {
    const response = await authAPI.register(data);
    const { access_token, refresh_token, user: userData } = response.data;
    try {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.warn('Could not persist auth to localStorage:', err);
    }
    setUser(userData);
    return userData;
  };

  const logout = () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    } catch (err) {
      console.warn('Could not clear auth storage:', err);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
