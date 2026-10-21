export const STORAGE_KEYS = {
  user: 'clubsphere_user',
};

export const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const clearStorage = (key) => {
  localStorage.removeItem(key);
};
