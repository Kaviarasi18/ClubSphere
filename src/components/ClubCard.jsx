import { ArrowRight, BadgeCheck, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ClubCard({ club }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-violet-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-4 border-b border-violet-200 p-4">
        <img src={club.logo} alt={club.name} className="h-16 w-16 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-lg font-bold text-violet-950">{club.name}</h3>
            {club.status === 'Verified' && <BadgeCheck size={16} className="text-emerald-600" />}
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-violet-600">{club.category}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <StatusBadge status={club.status} />
          <span className="flex items-center gap-1 text-xs text-violet-500">
            <Building2 size={14} /> {club.student_coordinator}
          </span>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-violet-700">{club.description}</p>
        <Link to={`/clubs/${club.id}`} className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
          View Club <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
