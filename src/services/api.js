// Base URL of the PHP backend.
// Override with VITE_API_URL in a .env file, otherwise defaults to the local
// PHP dev server (php -S localhost:8000) serving backend/api.php.
const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api.php';

async function request(path, options = {}) {
  const url = `${BASE_URL}/${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { error: text }; }

  if (!res.ok) {
    throw new Error(data?.error || `HTTP ${res.status}`);
  }
  return data;
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  login: (identifier, password) =>
    request('auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  register: (data) =>
    request('auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ── Clubs ─────────────────────────────────────────────────
export const clubsApi = {
  getAll: (status) =>
    request(status ? `clubs?status=${encodeURIComponent(status)}` : 'clubs'),

  getById: (id) => request(`clubs/${id}`),

  create: (data) =>
    request('clubs', { method: 'POST', body: JSON.stringify(data) }),

  updateStatus: (id, status, rejectionNote = '') =>
    request(`clubs/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, rejection_note: rejectionNote }),
    }),
};

// ── Events ────────────────────────────────────────────────
export const eventsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(qs ? `events?${qs}` : 'events');
  },

  getById: (id) => request(`events/${id}`),

  create: (data) =>
    request('events', { method: 'POST', body: JSON.stringify(data) }),

  cancel: (id) =>
    request(`events/${id}/cancel`, { method: 'PATCH' }),

  update: (id, data) =>
    request(`events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  getAll: () => request('users'),

  getById: (id) => request(`users/${id}`),

  toggleFollow: (userId, clubId) =>
    request(`users/${userId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ club_id: clubId }),
    }),
};

// ── Announcements ─────────────────────────────────────────
export const announcementsApi = {
  getAll: (clubId) =>
    request(clubId ? `announcements?club_id=${encodeURIComponent(clubId)}` : 'announcements'),

  create: (data) =>
    request('announcements', { method: 'POST', body: JSON.stringify(data) }),
};
