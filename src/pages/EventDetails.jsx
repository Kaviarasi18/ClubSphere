import { ArrowLeft, MapPin, CalendarDays, Clock3, Tag, Building2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { useClubs } from '../context/ClubContext';
import { useEvents } from '../context/EventContext';

export default function EventDetails() {
  const { eventId } = useParams();
  const { events } = useEvents();
  const { clubs } = useClubs();
  const event = events.find((item) => String(item.id) === String(eventId));

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-black text-slate-900">Event not found.</h1>
        <Link to="/events" className="mt-4 inline-flex rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">
          Back to events
        </Link>
      </main>
    );
  }

  const club = clubs.find((item) => String(item.id) === String(event.club_id));

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-red-700">
        <ArrowLeft size={16} /> Back to all events
      </Link>

      <article className="mt-8 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <img src={event.banner} alt={event.title} className="h-72 w-full object-cover md:h-[430px]" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">{event.title}</h1>
            <StatusBadge status={event.status} />
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 font-medium text-red-700">
              <Tag size={15} /> {event.category}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
              <Building2 size={15} /> {club?.name || 'Club'}
            </span>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                <CalendarDays size={16} className="text-red-600" /> Date
              </div>
              <p className="mt-3 text-base text-slate-800">{new Date(event.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                <Clock3 size={16} className="text-red-600" /> Time
              </div>
              <p className="mt-3 text-base text-slate-800">{new Date(event.start_datetime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - {new Date(event.end_datetime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                <MapPin size={16} className="text-red-600" /> Venue
              </div>
              <p className="mt-3 text-base text-slate-800">{event.venue}</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-black text-slate-900">About this event</h2>
            <p className="max-w-4xl text-base leading-8 text-slate-600">{event.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to={`/clubs/${club?.id}`} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
              Visit {club?.name || 'the organizing club'}
            </Link>
            <Link to="/events" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              See all events
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
