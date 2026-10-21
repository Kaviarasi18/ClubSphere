import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { useEvents } from '../../context/EventContext';
import { validateEventForm } from '../../utils/validation';

const initialForm = {
  title: '',
  category: 'Technical',
  description: '',
  venue: '',
  startDateTime: '',
  endDateTime: '',
};

export default function CreateEvent() {
  const { logout, user } = useAuth();
  const { clubs } = useClubs();
  const { addEvent } = useEvents();
  const club = clubs.find((item) => String(item.id) === String(user?.club_id));
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFieldChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (club?.status !== 'Verified') {
      setMessage({ type: 'error', text: 'Publishing is unavailable because your club is not verified yet.' });
      return;
    }

    const validationErrors = validateEventForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Please fix the highlighted validation issues before publishing.' });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await addEvent({
        club_id: club.id,
        title: form.title,
        category: form.category,
        description: form.description,
        venue: form.venue,
        start_datetime: form.startDateTime,
        end_datetime: form.endDateTime,
      });
      setForm(initialForm);
      setErrors({});
      setMessage({ type: 'success', text: 'Your event has been published and is now visible on the public events page.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create event. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="coordinator" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Create event</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Publish a new event</h1>
          </div>

          {club?.status !== 'Verified' && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Publishing is unavailable because this club is currently {club?.status || 'Pending'} and not yet verified.
            </div>
          )}

          {message && (
            <div className={`mb-6 rounded-2xl p-4 text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Event title</label>
              <input value={form.title} onChange={(e) => handleFieldChange('title', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.title && <p className="mt-2 text-xs text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select value={form.category} onChange={(e) => handleFieldChange('category', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100">
                {['Technical', 'Cultural', 'Literary', 'Entrepreneurship', 'Social Impact', 'Sports'].map((opt) => (
                  <option value={opt} key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea value={form.description} rows="4" onChange={(e) => handleFieldChange('description', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.description && <p className="mt-2 text-xs text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Venue</label>
              <input value={form.venue} onChange={(e) => handleFieldChange('venue', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.venue && <p className="mt-2 text-xs text-red-600">{errors.venue}</p>}
            </div>

            <div></div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Start date & time</label>
              <input type="datetime-local" value={form.startDateTime} onChange={(e) => handleFieldChange('startDateTime', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.startDateTime && <p className="mt-2 text-xs text-red-600">{errors.startDateTime}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">End date & time</label>
              <input type="datetime-local" value={form.endDateTime} onChange={(e) => handleFieldChange('endDateTime', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.endDateTime && <p className="mt-2 text-xs text-red-600">{errors.endDateTime}</p>}
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={club?.status !== 'Verified' || submitting}
                className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {submitting ? 'Publishing…' : 'Publish event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
