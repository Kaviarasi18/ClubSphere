import { useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { useEvents } from '../../context/EventContext';

export default function ManageEvents() {
  const { logout, user } = useAuth();
  const { clubs } = useClubs();
  const { events, cancelEvent } = useEvents();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [cancelling, setCancelling] = useState(null);

  const club = clubs.find((item) => String(item.id) === String(user?.club_id));

  const clubEvents = useMemo(
    () =>
      events
        .filter((event) => String(event.club_id) === String(user?.club_id))
        .filter((event) => {
          const matchesQuery = event.title.toLowerCase().includes(query.toLowerCase());
          const matchesFilter = filter === 'All' ? true : event.status === filter;
          return matchesQuery && matchesFilter;
        }),
    [events, filter, query, user?.club_id],
  );

  const handleCancel = async (id) => {
    setCancelling(id);
    try {
      await cancelEvent(id);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="coordinator" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Manage</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">{club?.name || 'My events'}</h1>
            </div>
            <div className="flex items-center gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search events"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
              >
                <option value="All">All</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {clubEvents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
              No events found for this club yet.
            </div>
          ) : (
            <div className="space-y-3">
              {clubEvents.map((event) => (
                <div key={event.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900">{event.title}</h3>
                      <StatusBadge status={event.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                      {new Date(event.start_datetime).toLocaleDateString()} • {event.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={event.status === 'cancelled' || cancelling === event.id}
                      onClick={() => handleCancel(event.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {cancelling === event.id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
