export default function Modal({ open, title, children, onClose, actionLabel, onAction }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-800">
            Close
          </button>
        </div>
        <div>{children}</div>
        {onAction && (
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              Cancel
            </button>
            <button type="button" onClick={onAction} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
