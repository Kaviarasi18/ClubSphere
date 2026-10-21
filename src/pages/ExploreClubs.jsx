import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ClubCard from '../components/ClubCard';
import { useClubs } from '../context/ClubContext';

const categories = ['All', 'Technical', 'Cultural', 'Literary', 'Entrepreneurship', 'Social Impact'];

export default function ExploreClubs() {
  const { clubs } = useClubs();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const verifiedClubs = useMemo(
    () =>
      clubs.filter(
        (club) =>
          club.status === 'Verified' &&
          (category === 'All' || club.category === category) &&
          `${club.name} ${club.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [category, clubs, query],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Campus clubs</p>
          <h1 className="mt-2 text-4xl font-black text-slate-900">Explore clubs</h1>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clubs"
            className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-700 outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
          />
        </div>
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === item ? 'bg-red-600 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {verifiedClubs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-xl font-semibold text-slate-700">No clubs match your current search.</p>
          <p className="mt-2 text-sm text-slate-500">Try another keyword or category to explore more student communities.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {verifiedClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
    </main>
  );
}
