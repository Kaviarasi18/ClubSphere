import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';

export default function ClubDirectory() {
  const { logout } = useAuth();
  const { clubs } = useClubs();
  const [query, setQuery] = useState('');

  const filteredClubs = useMemo(
    () =>
      clubs.filter((club) =>
        `${club.name} ${club.coordinator_name} ${club.coordinator_email}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [clubs, query],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="admin" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Directory</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">Club directory</h1>
            </div>
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search club or coordinator"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-6 font-medium">Club</th>
                  <th className="pb-3 pr-6 font-medium">Category</th>
                  <th className="pb-3 pr-6 font-medium">Coordinator</th>
                  <th className="pb-3 pr-6 font-medium">Email</th>
                  <th className="pb-3 pr-6 font-medium">Status</th>
                  <th className="pb-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredClubs.map((club) => (
                  <tr key={club.id} className="border-b border-slate-100">
                    <td className="py-4 pr-6 font-semibold text-slate-800">{club.name}</td>
                    <td className="py-4 pr-6 text-slate-600">{club.category}</td>
                    <td className="py-4 pr-6 text-slate-600">{club.coordinator_name}</td>
                    <td className="py-4 pr-6 text-slate-600">{club.coordinator_email}</td>
                    <td className="py-4 pr-6"><StatusBadge status={club.status} /></td>
                    <td className="py-4 text-slate-600">{new Date(club.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
