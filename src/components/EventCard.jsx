import { CalendarDays, MapPin, Users, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function EventCard({ event, clubName }) {
  const date = new Date(event.start_datetime);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img src={event.banner} alt={event.title} className="h-40 w-full object-cover" />
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-violet-700">
            {event.category}
          </span>
          <StatusBadge status={event.status} />
        </div>
        <h3 className="mb-2 text-xl font-bold text-violet-950">{event.title}</h3>
        <p className="mb-3 text-sm text-violet-500">{clubName}</p>
        <div className="space-y-2 text-sm text-violet-700">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-violet-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={16} className="text-violet-600" />
            <span>{new Date(event.start_datetime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-violet-600" />
            <span>{event.venue}</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-violet-500">
            <Users size={16} className="text-violet-600" />
            <span>Campus community</span>
          </div>
          <Link to={`/events/${event.id}`} className="inline-flex items-center rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
