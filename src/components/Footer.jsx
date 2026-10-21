import { HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-violet-200 bg-violet-50/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-lg font-black text-white">C</div>
            <div className="text-xl font-black text-violet-950">ClubSphere</div>
          </div>
          <p className="mt-4 text-sm leading-6 text-violet-700">
            Discover campus culture, student communities, and upcoming events across one connected college experience.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-violet-700">
            <li>Campus clubs</li>
            <li>Upcoming events</li>
            <li>Student opportunities</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">School</h3>
          <ul className="mt-4 space-y-3 text-sm text-violet-700">
            <li>About</li>
            <li>Student life</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-500">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-violet-700">
            <li>hello@clubsphere.edu</li>
            <li>+1 (555) 012-4242</li>
            <li>North Avenue Campus</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-violet-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm text-violet-600 sm:px-6 lg:px-8">
          <span>© 2026 ClubSphere</span>
          <span className="inline-flex items-center gap-2">
            <HeartHandshake size={14} className="text-violet-600" />
            Built for student discovery
          </span>
        </div>
      </div>
    </footer>
  );
}
