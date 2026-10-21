import { Mail, ShieldCheck, UserRound, Users } from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';

export default function MyClub() {
  const { logout, user } = useAuth();
  const { clubs } = useClubs();
  const club = clubs.find((item) => String(item.id) === String(user?.club_id));

  if (!club) {
    return (
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <Sidebar role="coordinator" onLogout={logout} />
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            Club details are unavailable.
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="coordinator" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Club profile</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">{club.name}</h1>
            </div>
            <StatusBadge status={club.status} />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <img src={club.logo} alt={club.name} className="h-20 w-20 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-red-600">{club.category}</p>
                  <p className="mt-2 text-lg font-bold text-slate-900">{club.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-800">
                <ShieldCheck size={18} className="text-red-600" />
                <span className="font-semibold">Verification status</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{club.status === 'Verified' ? 'Your club is live and events can be published publicly.' : 'Your club is still pending review and public publishing is currently disabled.'}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-800">
                <UserRound size={18} className="text-red-600" />
                <span className="font-semibold">Faculty coordinator</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{club.faculty_coordinator}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Users size={18} className="text-red-600" />
                <span className="font-semibold">Student coordinator</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{club.student_coordinator}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <div className="flex items-center gap-2 text-slate-800">
                <Mail size={18} className="text-red-600" />
                <span className="font-semibold">Official contact</span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{club.email}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 md:col-span-2">
              <p className="font-semibold text-slate-800">Description</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{club.description}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
