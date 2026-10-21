import { LayoutGrid, UserCog, ShieldCheck, FolderKanban, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const adminItems = [
  { label: 'Overview', to: '/admin', icon: LayoutGrid },
  { label: 'Create Club', to: '/admin/create-club', icon: UserCog },
  { label: 'Verify Clubs', to: '/admin/verify-clubs', icon: ShieldCheck },
  { label: 'Club Directory', to: '/admin/club-directory', icon: FolderKanban },
];

const coordinatorItems = [
  { label: 'Overview', to: '/coordinator', icon: LayoutGrid },
  { label: 'Create Event', to: '/coordinator/create-event', icon: UserCog },
  { label: 'Manage Events', to: '/coordinator/manage-events', icon: FolderKanban },
  { label: 'My Club', to: '/coordinator/my-club', icon: ShieldCheck },
];

export default function Sidebar({ role, onLogout }) {
  const items = role === 'admin' ? adminItems : coordinatorItems;

  return (
    <aside className="h-full min-h-[80vh] w-full rounded-3xl border border-violet-200 bg-white p-4 shadow-sm shadow-violet-100/60">
      <div className="mb-6 px-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">{role === 'admin' ? 'Admin Panel' : 'Coordinator Panel'}</p>
        <h2 className="mt-2 text-2xl font-bold text-violet-950">ClubSphere</h2>
      </div>
      <nav className="space-y-2">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                isActive ? 'bg-violet-600 text-white shadow-sm shadow-violet-200' : 'text-violet-700 hover:bg-violet-50 hover:text-violet-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <button
        type="button"
        onClick={onLogout}
        className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-violet-200 px-3 py-3 text-sm font-medium text-violet-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-800"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}
