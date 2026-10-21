import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();
  const [identifier, setIdentifier] = useState(location.state?.registered ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(
    location.state?.registered ? `Account created for ${location.state.registered}. Login to continue.` : '',
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    const result = await login(identifier, password);
    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.user.role === 'admin') navigate('/admin');
    else if (result.user.role === 'coordinator') navigate('/coordinator');
    else navigate('/student');
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden rounded-[2rem] border border-violet-200 bg-white shadow-sm shadow-violet-100/80 lg:grid-cols-2">
        <div className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 p-8 text-white lg:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-100">Sign in</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight">ClubSphere access</h1>
          <p className="mt-4 max-w-md text-base text-violet-50">
            Sign in as a Student, Club Coordinator, or Admin to explore ClubSphere's features.
          </p>
          <div className="mt-10 rounded-2xl border border-white/25 bg-white/10 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-violet-100">Login with your credentials</p>
            <p className="mt-2 text-sm text-violet-200">
              Use the email and password provided by your administrator.
            </p>
          </div>
        </div>

        <div className="p-8 lg:p-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-600">Welcome back</p>
            <h2 className="mt-2 text-3xl font-black text-violet-950">Login to continue</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Email or username</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="your@email.edu"
                  className="w-full rounded-2xl border border-violet-200 bg-violet-50 py-3 pl-12 pr-4 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-violet-700">Password</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-violet-200 bg-violet-50 py-3 pl-12 pr-12 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-violet-500">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {notice && <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</p>}

            {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-violet-600">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-violet-800 underline-offset-4 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
