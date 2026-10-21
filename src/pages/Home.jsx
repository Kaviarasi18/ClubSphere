import { ArrowRight, Compass, ShieldCheck, Sparkles, Trophy, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { useClubs } from '../context/ClubContext';
import { useEvents } from '../context/EventContext';

const categories = [
  { name: 'Technical', icon: Sparkles },
  { name: 'Cultural', icon: Trophy },
  { name: 'Sports', icon: Users },
  { name: 'Literary', icon: Compass },
  { name: 'Entrepreneurship', icon: ShieldCheck },
  { name: 'Social Impact', icon: Users },
];

export default function Home() {
  const { clubs, loading: clubsLoading, error: clubsError } = useClubs();
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const isLoading = clubsLoading || eventsLoading;
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const verifiedClubs = useMemo(() => clubs.filter((club) => club.status === 'Verified'), [clubs]);
  const upcomingEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.status === 'published')
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
        .slice(0, 3),
    [events],
  );

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/events?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="overflow-hidden rounded-[2rem] border border-violet-200 bg-gradient-to-br from-white via-violet-50 to-violet-100 p-8 shadow-sm shadow-violet-100/60 lg:p-12">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
              Campus discovery platform
            </span>
            <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight text-violet-950 md:text-5xl">
              Discover Your Campus. Find Your Community.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-violet-700">
              Explore verified clubs, upcoming college events, and vibrant student communities in one modern platform.
            </p>
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl">
              <SearchBar value={search} onChange={setSearch} placeholder="Search clubs or events" />
            </form>
          </div>
          <div className="rounded-3xl border border-violet-200 bg-white p-6 shadow-lg shadow-violet-100/60">
            <div className="grid gap-4 md:grid-cols-2">
              {[{ label: 'Active clubs', value: isLoading ? '—' : verifiedClubs.length }, { label: 'Upcoming events', value: isLoading ? '—' : upcomingEvents.length }, { label: 'Categories', value: categories.length }, { label: 'Verified status', value: '100%' }].map((item) => (
                <div key={item.label} className="rounded-2xl bg-violet-50 p-4">
                  <div className="text-2xl font-black text-violet-950">{item.value}</div>
                  <div className="mt-1 text-sm text-violet-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Featured</p>
            <h2 className="mt-2 text-3xl font-black text-violet-950">Upcoming events</h2>
          </div>
          <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-[350px] animate-pulse rounded-2xl bg-violet-100" />
            ))}
          </div>
        ) : eventsError || clubsError ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700" role="alert">
            Unable to load campus data: {eventsError || clubsError}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} clubName={clubs.find((club) => String(club.id) === String(event.club_id))?.name || 'Club'} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Popular groups</p>
            <h2 className="mt-2 text-3xl font-black text-violet-950">Trending clubs</h2>
          </div>
          <Link to="/clubs" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
            Explore all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {verifiedClubs.slice(0, 4).map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Discover by interest</p>
          <h2 className="mt-2 text-3xl font-black text-violet-950">Event categories</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {categories.map(({ name, icon: Icon }) => (
            <Link
              key={name}
              to={`/events?category=${encodeURIComponent(name)}`}
              className="block rounded-2xl border border-violet-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-md"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <Icon size={20} />
              </div>
              <div className="mt-4 text-base font-bold text-violet-950">{name}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] border border-violet-200 bg-violet-50/80 p-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {[
            { title: 'Find the right space', text: 'Browse clubs that match your interests, skill level, and identity.' },
            { title: 'Stay ahead of campus events', text: 'Track technical and cultural programming before they fill up.' },
            { title: 'Build your community', text: 'Connect with student groups and real engagement opportunities on campus.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl bg-white p-6 shadow-sm shadow-violet-100/80">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                <Sparkles size={20} />
              </div>
              <h3 className="text-xl font-bold text-violet-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-violet-700">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
