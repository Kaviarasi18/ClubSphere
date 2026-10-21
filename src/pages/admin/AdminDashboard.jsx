import { Activity, BadgeCheck, Clock3, ShieldAlert, Users } from 'lucide-react';
import { useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';

const statCards = [
  { label: 'Total clubs', icon: Users, key: 'total' },
  { label: 'Verified clubs', icon: BadgeCheck, key: 'verified' },
  { label: 'Pending verification', icon: Clock3, key: 'pending' },
  { label: 'Rejected clubs', icon: ShieldAlert, key: 'rejected' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { clubs } = useClubs();

  const stats = useMemo(() => ({
    total: clubs.length,
    verified: clubs.filter((club) => club.status === 'Verified').length,
    pending: clubs.filter((club) => club.status === 'Pending').length,
    rejected: clubs.filter((club) => club.status === 'Rejected').length,
  }), [clubs]);

  const recentActivity = [...clubs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="admin" onLogout={logout} />
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Overview</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">Welcome, {user?.name}</h1>
              </div>
              <div className="rounded-2xl bg-red-50 p-3 text-red-700"><Activity size={26} /></div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, icon: Icon, key }) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{stats[key]}</p>
                  </div>
                  <div className="rounded-2xl bg-red-50 p-3 text-red-700"><Icon size={18} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Recent club activity</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 pr-6 font-medium">Club</th>
                    <th className="pb-3 pr-6 font-medium">Category</th>
                    <th className="pb-3 pr-6 font-medium">Coordinator</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((club) => (
                    <tr key={club.id} className="border-b border-slate-100 align-middle">
                      <td className="py-4 pr-6 font-semibold text-slate-800">{club.name}</td>
                      <td className="py-4 pr-6 text-slate-600">{club.category}</td>
                      <td className="py-4 pr-6 text-slate-600">{club.coordinator_name}</td>
                      <td className="py-4"><StatusBadge status={club.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
