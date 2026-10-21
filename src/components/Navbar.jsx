import { Menu, UserCircle2 } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Explore Clubs', to: '/clubs' },
  { label: 'Events', to: '/events' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const roleRoute = user?.role === 'admin' ? '/admin' : user?.role === 'coordinator' ? '/coordinator' : '/student';
  const roleLabel = user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'coordinator' ? 'Coordinator Dashboard' : 'My Dashboard';

  return (
    <header className="sticky top-0 z-40 border-b border-violet-200 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-lg font-black text-white shadow-sm shadow-violet-200">C</div>
          <div>
            <div className="text-xl font-black tracking-tight text-violet-950">ClubSphere</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-violet-700' : 'text-violet-600 hover:text-violet-900'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to={roleRoute} className="hidden items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 md:inline-flex">
                <UserCircle2 size={18} />
                {roleLabel}
              </Link>
              <button type="button" onClick={logout} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                Logout
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/register' && (
                <Link to="/register" className="hidden rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700 transition hover:border-violet-300 sm:inline-block">
                  Register
                </Link>
              )}
              <Link to={location.pathname === '/login' ? '/' : '/login'} className="rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700">
                Login
              </Link>
            </>
          )}
          <button type="button" className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-violet-50 p-2 text-violet-700 md:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
