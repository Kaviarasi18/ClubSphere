import { Filter, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { useClubs } from '../context/ClubContext';
import { useEvents } from '../context/EventContext';

export default function EventsPage() {
  const { clubs, loading: clubsLoading, error: clubsError } = useClubs();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const [params, setParams] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'All');
  const [search, setSearch] = useState(params.get('search') || '');
  const [clubFilter, setClubFilter] = useState('All clubs');

  useEffect(() => {
    setCategory(params.get('category') || 'All');
    setSearch(params.get('search') || '');
  }, [params]);

  const filteredEvents = useMemo(() => {
    const verifiedClubIds = new Set(clubs.filter((club) => club.status === 'Verified').map((club) => String(club.id)));
    return [...events]
      .filter((event) => event.status === 'published')
      .filter((event) => verifiedClubIds.has(String(event.club_id)))
      .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
      .filter((event) => (category === 'All' || event.category === category))
      .filter((event) => {
        const club = clubs.find((item) => String(item.id) === String(event.club_id));
        const searchText = `${event.title} ${club?.name || ''}`.toLowerCase();
        return searchText.includes(search.toLowerCase());
      })
      .filter((event) => (clubFilter === 'All clubs' || clubs.find((club) => String(club.id) === String(event.club_id))?.name === clubFilter));
  }, [category, clubs, clubFilter, events, search]);

  const categories = ['All', ...new Set(events.map((event) => event.category))];
  const clubOptions = ['All clubs', ...new Set(clubs.filter((club) => club.status === 'Verified').map((club) => club.name))];

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Campus highlights</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Upcoming events</h1>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setParams({ search: event.target.value, category });
            }}
            placeholder="Search by event or club" 
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <Filter size={16} className="text-red-600" />
          <select
            value={category}
            onChange={(event) => {
              const nextCategory = event.target.value;
              setCategory(nextCategory);
              setParams({ category: nextCategory, search });
            }}
            className="bg-transparent outline-none"
          >
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
          <select
            value={clubFilter}
            onChange={(event) => setClubFilter(event.target.value)}
            className="bg-transparent outline-none"
          >
            {clubOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {clubsLoading || eventsLoading ? (
        <p className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500" role="status">
          Loading events…
        </p>
      ) : clubsError || eventsError ? (
        <p className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center text-sm text-red-700" role="alert">
          Unable to load events: {eventsError || clubsError}
        </p>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-xl font-semibold text-slate-700">No events are available for the current filters.</p>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your search, category, or club selection.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} clubName={clubs.find((club) => String(club.id) === String(event.club_id))?.name || 'Club'} />
          ))}
        </div>
      )}
    </main>
  );
}
