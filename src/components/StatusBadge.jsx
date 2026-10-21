const statusClasses = {
  Verified: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border border-amber-200',
  Rejected: 'bg-violet-100 text-violet-700 border border-violet-200',
  published: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  cancelled: 'bg-violet-100 text-violet-700 border border-violet-200',
};

export default function StatusBadge({ status }) {
  const label = typeof status === 'string' ? status : 'Pending';
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[label] || statusClasses.Pending}`}>
      {label}
    </span>
  );
}
