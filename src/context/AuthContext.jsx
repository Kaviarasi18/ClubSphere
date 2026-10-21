import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { authApi } from '../services/api';
import { clearStorage, loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => loadFromStorage(STORAGE_KEYS.user, null));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(identifier, password);
      const userPayload = data.user;
      setUser(userPayload);
      saveToStorage(STORAGE_KEYS.user, userPayload);
      return { success: true, user: userPayload };
    } catch (err) {
      return { success: false, message: err.message || 'Invalid credentials.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStorage(STORAGE_KEYS.user);
  }, []);

  const value = useMemo(() => ({ user, login, logout, loading }), [user, login, logout, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
