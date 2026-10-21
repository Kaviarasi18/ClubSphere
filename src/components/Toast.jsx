import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => onDismiss(), 2500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const Icon = toast.type === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="flex items-start gap-3">
        <div className={`rounded-full p-2 ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
          <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
        </div>
        <button type="button" className="text-slate-400 hover:text-slate-700" onClick={onDismiss}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
