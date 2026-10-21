import { ArrowLeft, CalendarRange, Mail, Phone, UserRound } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useClubs } from '../context/ClubContext';
import { useEvents } from '../context/EventContext';

export default function ClubDetails() {
  const { clubs } = useClubs();
  const { events } = useEvents();
  const { clubId } = useParams();
  const club = clubs.find((item) => String(item.id) === String(clubId));

  if (!club) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-900">Club not found.</h1>
        <Link to="/clubs" className="mt-4 inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
          Back to clubs
        </Link>
      </main>
    );
  }

  const clubEvents = events.filter((event) => String(event.club_id) === String(club.id) && event.status === 'published');

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <Link to="/clubs" className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
        <ArrowLeft size={16} /> Back to clubs
      </Link>

      <section className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-8 p-6 lg:grid-cols-[0.6fr_1.4fr] lg:p-8">
          <img src={club.logo} alt={club.name} className="h-full min-h-[240px] w-full rounded-3xl object-cover" />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900">{club.name}</h1>
              <StatusBadge status={club.status} />
            </div>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">{club.category}</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">{club.description}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Faculty coordinator</p>
                <div className="mt-2 flex items-center gap-2 text-slate-800">
                  <UserRound size={16} className="text-red-600" />
                  {club.faculty_coordinator}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Student coordinator</p>
                <div className="mt-2 flex items-center gap-2 text-slate-800">
                  <UserRound size={16} className="text-red-600" />
                  {club.student_coordinator}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Official email</p>
                <div className="mt-2 flex items-center gap-2 text-slate-800">
                  <Mail size={16} className="text-red-600" />
                  {club.email}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Contact</p>
                <div className="mt-2 flex items-center gap-2 text-slate-800">
                  <Phone size={16} className="text-red-600" />
                  +1 (555) 300-1404
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <CalendarRange size={20} className="text-red-600" />
          <h2 className="text-2xl font-black text-slate-900">Upcoming events</h2>
        </div>
        {clubEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
            This club has no published events right now.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {clubEvents.map((event) => (
              <div key={event.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <img src={event.banner} alt={event.title} className="h-40 w-full object-cover" />
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-red-600">{event.category}</p>
                  <h3 className="mt-2 text-xl font-bold text-slate-900">{event.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
                  <div className="mt-4 flex justify-between">
                    <span className="text-sm text-slate-500">{new Date(event.start_datetime).toLocaleDateString()}</span>
                    <Link to={`/events/${event.id}`} className="text-sm font-semibold text-red-700">View event</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
