import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { validateClubForm } from '../../utils/validation';

const initialForm = {
  name: '',
  category: 'Technical',
  description: '',
  faculty_coordinator: '',
  student_coordinator: '',
  email: '',
  identification_details: '',
  coordinator_name: '',
  coordinator_email: '',
};

export default function CreateClub() {
  const { logout } = useAuth();
  const { addClub } = useClubs();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [createdClub, setCreatedClub] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  // Map form fields to validation-compatible keys
  const toValidationShape = (f) => ({
    name: f.name,
    category: f.category,
    description: f.description,
    facultyCoordinator: f.faculty_coordinator,
    studentCoordinator: f.student_coordinator,
    email: f.email,
    identificationDetails: f.identification_details,
    coordinatorName: f.coordinator_name,
    coordinatorEmail: f.coordinator_email,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const fieldErrors = validateClubForm(toValidationShape(form));
    if (Object.keys(fieldErrors).length > 0) {
      // Map errors back to snake_case keys for display
      const mapped = {};
      if (fieldErrors.facultyCoordinator) mapped.faculty_coordinator = fieldErrors.facultyCoordinator;
      if (fieldErrors.studentCoordinator) mapped.student_coordinator = fieldErrors.studentCoordinator;
      if (fieldErrors.identificationDetails) mapped.identification_details = fieldErrors.identificationDetails;
      if (fieldErrors.coordinatorName) mapped.coordinator_name = fieldErrors.coordinatorName;
      if (fieldErrors.coordinatorEmail) mapped.coordinator_email = fieldErrors.coordinatorEmail;
      setErrors({ ...fieldErrors, ...mapped });
      return;
    }

    setSubmitting(true);
    try {
      const result = await addClub(form);
      setCreatedClub(result);
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      setServerError(err.message || 'Failed to create club. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setCreatedClub(null);
    setServerError('');
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="admin" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Create club</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Register a new student club</h1>
          </div>

          {serverError && (
            <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{serverError}</div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="mb-2 block text-sm font-medium text-slate-700">Club name</label>
              <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Category</label>
              <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100">
                {['Technical', 'Cultural', 'Literary', 'Entrepreneurship', 'Social Impact'].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
              <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows="4" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.description && <p className="mt-2 text-xs text-red-600">{errors.description}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Faculty coordinator</label>
              <input value={form.faculty_coordinator} onChange={(e) => handleChange('faculty_coordinator', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.faculty_coordinator && <p className="mt-2 text-xs text-red-600">{errors.faculty_coordinator}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Student coordinator</label>
              <input value={form.student_coordinator} onChange={(e) => handleChange('student_coordinator', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.student_coordinator && <p className="mt-2 text-xs text-red-600">{errors.student_coordinator}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Official club email</label>
              <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Coordinator name</label>
              <input value={form.coordinator_name} onChange={(e) => handleChange('coordinator_name', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.coordinator_name && <p className="mt-2 text-xs text-red-600">{errors.coordinator_name}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Club identification details</label>
              <textarea value={form.identification_details} onChange={(e) => handleChange('identification_details', e.target.value)} rows="4" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.identification_details && <p className="mt-2 text-xs text-red-600">{errors.identification_details}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">Coordinator email</label>
              <input value={form.coordinator_email} onChange={(e) => handleChange('coordinator_email', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100" />
              {errors.coordinator_email && <p className="mt-2 text-xs text-red-600">{errors.coordinator_email}</p>}
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button type="submit" disabled={submitting} className="rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? 'Creating…' : 'Create club'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">Reset form</button>
            </div>
          </form>

          {createdClub && (
            <div className="mt-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">Club created successfully</p>
              <p className="mt-2 text-sm text-slate-600">Status: <span className="font-semibold">Pending</span> — share these credentials with the coordinator:</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Username</p>
                  <p className="mt-2 font-semibold text-slate-800">{createdClub.credentials?.username}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Email</p>
                  <p className="mt-2 font-semibold text-slate-800">{createdClub.credentials?.email}</p>
                </div>
                <div className="rounded-2xl bg-white p-3">
                  <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Temporary password</p>
                  <p className="mt-2 font-semibold text-slate-800">{createdClub.credentials?.password}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-500">Ask the coordinator to change their password after first login.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
