import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { eventsApi } from '../services/api';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchEvents = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventsApi.getAll(params);
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const addEvent = useCallback(async (formData) => {
    const result = await eventsApi.create(formData);
    await fetchEvents();
    return result;
  }, [fetchEvents]);

  const updateEvent = useCallback(async (id, formData) => {
    await eventsApi.update(id, formData);
    await fetchEvents();
  }, [fetchEvents]);

  const cancelEvent = useCallback(async (id) => {
    await eventsApi.cancel(id);
    await fetchEvents();
  }, [fetchEvents]);

  const value = useMemo(
    () => ({ events, loading, error, addEvent, updateEvent, cancelEvent, refetch: fetchEvents }),
    [events, loading, error, addEvent, updateEvent, cancelEvent, fetchEvents],
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
};
