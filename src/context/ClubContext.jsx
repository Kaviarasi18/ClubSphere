import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clubsApi } from '../services/api';

const ClubContext = createContext(null);

export const ClubProvider = ({ children }) => {
  const [clubs, setClubs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const fetchClubs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await clubsApi.getAll();
      setClubs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchClubs(); }, [fetchClubs]);

  const addClub = useCallback(async (formData) => {
    const result = await clubsApi.create(formData);
    await fetchClubs();
    return result;
  }, [fetchClubs]);

  const updateClubStatus = useCallback(async (id, status, note = '') => {
    await clubsApi.updateStatus(id, status, note);
    await fetchClubs();
  }, [fetchClubs]);

  const value = useMemo(
    () => ({ clubs, loading, error, addClub, updateClubStatus, refetch: fetchClubs }),
    [clubs, loading, error, addClub, updateClubStatus, fetchClubs],
  );

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};

export const useClubs = () => {
  const context = useContext(ClubContext);
  if (!context) throw new Error('useClubs must be used within a ClubProvider');
  return context;
};
