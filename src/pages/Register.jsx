import { Eye, EyeOff, LockKeyhole, Mail, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { validateRegister } from '../utils/validation';

const initialForm = {
  name: '',
  username: '',
  email: '',
  role: 'student',
  department: '',
  year: '',
  rollNumber: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : user.role === 'coordinator' ? '/coordinator' : '/student', { replace: true });
    return null;
  }

  const handleChange = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');

    const validationErrors = validateRegister(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await authApi.register({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        department: form.role === 'student' ? form.department.trim() : '',
        year: form.role === 'student' ? form.year.trim() : '',
        roll_number: form.role === 'student' ? form.rollNumber.trim() : '',
      });
      navigate('/login', { state: { registered: form.email.trim() } });
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (key) =>
    `w-full rounded-2xl border bg-violet-50 py-3 pl-12 pr-4 text-sm outline-none focus:ring-4 ${
      errors[key] ? 'border-red-300 focus:border-red-300 focus:ring-red-100' : 'border-violet-200 focus:border-violet-300 focus:ring-violet-100'
    }`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-sm shadow-violet-100/80 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 p-8 text-white lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">Sign up</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">Join ClubSphere</h1>
          <p className="mt-4 max-w-md text-base text-violet-50">
            Create your account to discover clubs, attend events, and stay updated with your campus community.
          </p>
          <div className="mt-10 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-violet-100">Already have an account?</p>
            <p className="mt-2 text-sm text-violet-200">
              Sign in with your email or username and password.
            </p>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Create account</p>
            <h2 className="mt-2 text-3xl font-black text-violet-950">Register to continue</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Full name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  value={form.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Your full name"
                  className={fieldClass('name')}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Username</label>
              <div className="relative">
                <UserPlus className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  value={form.username}
                  onChange={(event) => handleChange('username', event.target.value)}
                  placeholder="e.g. priya.s"
                  className={fieldClass('username')}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  placeholder="your@email.edu"
                  className={fieldClass('email')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Role</label>
              <select
                value={form.role}
                onChange={(event) => handleChange('role', event.target.value)}
                className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              >
                <option value="student">Student</option>
                <option value="coordinator">Club Coordinator</option>
              </select>
            </div>

            {form.role === 'student' && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-violet-700">Department</label>
                  <input
                    value={form.department}
                    onChange={(event) => handleChange('department', event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-violet-700">Year</label>
                  <input
                    value={form.year}
                    onChange={(event) => handleChange('year', event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-violet-700">Roll number</label>
                  <input
                    value={form.rollNumber}
                    onChange={(event) => handleChange('rollNumber', event.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => handleChange('password', event.target.value)}
                  placeholder="At least 6 characters"
                  className={`pr-12 ${fieldClass('password')}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-violet-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Confirm password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(event) => handleChange('confirmPassword', event.target.value)}
                  placeholder="Re-enter your password"
                  className={fieldClass('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {serverError && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-violet-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-violet-800 underline-offset-4 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
