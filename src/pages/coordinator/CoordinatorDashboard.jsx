import { Activity, CalendarCheck2, Clock3, ShieldAlert, Users } from 'lucide-react';
import { useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { useEvents } from '../../context/EventContext';

export default function CoordinatorDashboard() {
  const { user, logout } = useAuth();
  const { clubs } = useClubs();
  const { events } = useEvents();
  const club = clubs.find((item) => String(item.id) === String(user?.club_id));

  const clubEvents = useMemo(
    () => events.filter((event) => String(event.club_id) === String(user?.club_id)),
    [events, user?.club_id],
  );

  const upcomingCount = clubEvents.filter((event) => event.status === 'published').length;
  const cancelledCount = clubEvents.filter((event) => event.status === 'cancelled').length;

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="coordinator" onLogout={logout} />
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">Overview</p>
                <h1 className="mt-2 text-3xl font-black text-slate-900">{club?.name || 'Club Dashboard'}</h1>
              </div>
              <div className="flex items-center gap-2"><StatusBadge status={club?.status || 'Pending'} /></div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Events created', value: clubEvents.length, icon: Activity },
              { label: 'Upcoming events', value: upcomingCount, icon: CalendarCheck2 },
              { label: 'Cancelled events', value: cancelledCount, icon: ShieldAlert },
              { label: 'Members tracked', value: 'N/A', icon: Users },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
                  </div>
                  <div className="rounded-2xl bg-red-50 p-3 text-red-700"><Icon size={18} /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-900">Recent updates</h2>
            <div className="mt-4 space-y-3">
              {clubEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                  <div>
                    <p className="font-semibold text-slate-800">{event.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{new Date(event.start_datetime).toLocaleDateString()} • {event.status}</p>
                  </div>
                  <div className="text-sm text-slate-500"><Clock3 size={16} className="inline-block" /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
