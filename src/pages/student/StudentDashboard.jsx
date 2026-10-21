import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  Heart,
  MapPin,
  Search,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';
import { useEvents } from '../../context/EventContext';
import { announcementsApi, usersApi } from '../../services/api';

const categoryColors = {
  Technical: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  Cultural: { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500' },
  Entrepreneurship: { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Social Impact': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
  Literary: { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const { clubs } = useClubs();
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedClubs, setFollowedClubs] = useState(user?.followed_clubs ?? []);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!user?.id) return undefined;
    let active = true;
    usersApi
      .getById(user.id)
      .then((data) => {
        if (active) setFollowedClubs(data.followed_clubs ?? []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    let active = true;
    announcementsApi
      .getAll()
      .then((data) => {
        if (active) setAnnouncements(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const isFollowingClub = useCallback(
    (clubId) => followedClubs.some((id) => String(id) === String(clubId)),
    [followedClubs],
  );

  const followedClubDetails = useMemo(
    () => clubs.filter((c) => isFollowingClub(c.id) && c.status === 'Verified'),
    [clubs, isFollowingClub],
  );

  const allVerifiedClubs = clubs.filter((c) => c.status === 'Verified');

  const feedEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(
        (e) =>
          e.status === 'published' &&
          new Date(e.start_datetime) > now &&
          isFollowingClub(e.club_id),
      )
      .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
  }, [events, isFollowingClub]);

  const allUpcomingEvents = useMemo(() => {
    const now = new Date();
    const q = searchQuery.toLowerCase();
    return events
      .filter(
        (e) =>
          e.status === 'published' &&
          new Date(e.start_datetime) > now &&
          (e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)),
      )
      .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
  }, [events, searchQuery]);

  const feedAnnouncements = useMemo(
    () => announcements.filter((a) => isFollowingClub(a.club_id)),
    [announcements, isFollowingClub],
  );

  const toggleFollow = async (clubId) => {
    try {
      const res = await usersApi.toggleFollow(user.id, clubId);
      setFollowedClubs((prev) =>
        res.following
          ? prev.some((id) => String(id) === String(clubId))
            ? prev
            : [...prev, clubId]
          : prev.filter((id) => String(id) !== String(clubId)),
      );
    } catch {
      /* keep previous state on failure */
    }
  };

  const typeStyles = {
    announcement: { bg: 'bg-violet-100', text: 'text-violet-700', label: 'Announcement' },
    update: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Update' },
    reminder: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Reminder' },
    resource: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resource' },
    volunteer: { bg: 'bg-pink-100', text: 'text-pink-700', label: 'Volunteer' },
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-500">
            Student Portal
          </p>
          <h1 className="mt-1 text-3xl font-black text-violet-950">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-violet-500">
            {user?.department} · {user?.year} · Roll No: {user?.roll_number}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2">
            <Users size={16} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-800">
              {followedClubs.length} clubs followed
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-2">
            <Calendar size={16} className="text-violet-500" />
            <span className="text-sm font-semibold text-violet-800">
              {feedEvents.length} upcoming
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl border border-violet-100 bg-violet-50 p-1">
        {[
          { id: 'feed', label: 'My Feed', icon: TrendingUp },
          { id: 'announcements', label: 'Posts & Announcements', icon: Bell },
          { id: 'discover', label: 'Discover Events', icon: Search },
          { id: 'clubs', label: 'My Clubs', icon: Heart },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              activeTab === id
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-violet-500 hover:text-violet-700'
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── MY FEED TAB ── */}
      {activeTab === 'feed' && (
        <div className="space-y-4">
          {feedEvents.length === 0 ? (
            <div className="rounded-3xl border border-violet-100 bg-violet-50 px-6 py-16 text-center">
              <Calendar size={40} className="mx-auto mb-4 text-violet-300" />
              <p className="font-semibold text-violet-700">No upcoming events from your clubs</p>
              <p className="mt-1 text-sm text-violet-400">
                Follow clubs in the "Discover Events" tab to see their events here
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="mt-4 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Explore Events
              </button>
            </div>
          ) : (
            feedEvents.map((event) => {
              const club = clubs.find((c) => String(c.id) === String(event.club_id));
              const colors = categoryColors[event.category] ?? categoryColors.Technical;
              return (
                <div
                  key={event.id}
                  className="group flex overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition hover:shadow-md hover:shadow-violet-100"
                >
                  <div className="relative h-auto w-36 flex-shrink-0 overflow-hidden sm:w-48">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                          {event.category}
                        </span>
                        {club && (
                          <span className="text-xs text-violet-400">by {club.name}</span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-violet-950">{event.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-violet-500">
                        {event.description}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-violet-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} />
                        {formatDate(event.start_datetime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {formatTime(event.start_datetime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {event.venue}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pr-5">
                    <Link
                      to={`/events/${event.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 text-violet-600 transition hover:bg-violet-600 hover:text-white"
                    >
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── ANNOUNCEMENTS TAB ── */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {feedAnnouncements.length === 0 ? (
            <div className="rounded-3xl border border-violet-100 bg-violet-50 px-6 py-16 text-center">
              <Bell size={40} className="mx-auto mb-4 text-violet-300" />
              <p className="font-semibold text-violet-700">No announcements yet</p>
              <p className="mt-1 text-sm text-violet-400">
                Follow clubs to see their posts and announcements here
              </p>
            </div>
          ) : (
            feedAnnouncements.map((ann) => {
              const club = clubs.find((c) => String(c.id) === String(ann.club_id));
              const clubName = club?.name || 'Club';
              const style = typeStyles[ann.type] ?? typeStyles.announcement;
              return (
                <div
                  key={ann.id}
                  className="flex gap-4 rounded-3xl border border-violet-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {club?.logo ? (
                      <img
                        src={club.logo}
                        alt={clubName}
                        className="h-12 w-12 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-600">
                        {clubName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-violet-900">{clubName}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                      <span className="ml-auto text-xs text-violet-400">
                        {timeAgo(ann.posted_at)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-violet-700">{ann.message}</p>
                    <Link
                      to={`/clubs/${ann.club_id}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-violet-500 hover:text-violet-700"
                    >
                      View Club <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── DISCOVER EVENTS TAB ── */}
      {activeTab === 'discover' && (
        <div>
          <div className="relative mb-6">
            <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-violet-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name or category…"
              className="w-full rounded-2xl border border-violet-200 bg-violet-50 py-3 pl-12 pr-4 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allUpcomingEvents.map((event) => {
              const club = clubs.find((c) => String(c.id) === String(event.club_id));
              const isFollowing = isFollowingClub(event.club_id);
              const colors = categoryColors[event.category] ?? categoryColors.Technical;
              return (
                <div
                  key={event.id}
                  className="flex flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm transition hover:shadow-md hover:shadow-violet-100"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={event.banner}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text}`}
                    >
                      {event.category}
                    </span>
                    {isFollowing && (
                      <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-violet-600/90 px-2 py-0.5 text-xs font-semibold text-white">
                        <Star size={11} fill="currentColor" /> Following
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="mb-1 text-xs text-violet-400">{club?.name}</p>
                    <h3 className="text-sm font-bold text-violet-950">{event.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-violet-500">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(event.start_datetime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} />
                        {event.venue}
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to={`/events/${event.id}`}
                        className="flex-1 rounded-full border border-violet-200 py-1.5 text-center text-xs font-semibold text-violet-700 hover:bg-violet-50"
                      >
                        Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFollow(event.club_id)}
                        className={`flex-1 rounded-full py-1.5 text-xs font-semibold transition ${
                          isFollowing
                            ? 'bg-violet-600 text-white hover:bg-violet-700'
                            : 'bg-violet-100 text-violet-700 hover:bg-violet-200'
                        }`}
                      >
                        {isFollowing ? 'Following' : 'Follow Club'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MY CLUBS TAB ── */}
      {activeTab === 'clubs' && (
        <div>
          {followedClubDetails.length === 0 ? (
            <div className="rounded-3xl border border-violet-100 bg-violet-50 px-6 py-16 text-center">
              <Heart size={40} className="mx-auto mb-4 text-violet-300" />
              <p className="font-semibold text-violet-700">You haven't followed any clubs yet</p>
              <p className="mt-1 text-sm text-violet-400">
                Discover events and follow clubs to see them here
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="mt-4 rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
              >
                Discover Events
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {followedClubDetails.map((club) => {
                const clubEvents = events.filter(
                  (e) =>
                    String(e.club_id) === String(club.id) &&
                    e.status === 'published' &&
                    new Date(e.start_datetime) > new Date(),
                );
                return (
                  <div
                    key={club.id}
                    className="flex flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-sm"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={club.logo}
                        alt={club.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-3 left-3 text-sm font-bold text-white">
                        {club.name}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="mb-1 text-xs text-violet-400">{club.category}</p>
                      <p className="line-clamp-2 text-xs text-violet-600">{club.description}</p>
                      <div className="mt-2 flex items-center gap-1 text-xs text-violet-500">
                        <BookOpen size={12} />
                        <span>
                          {clubEvents.length} upcoming event{clubEvents.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Link
                          to={`/clubs/${club.id}`}
                          className="flex-1 rounded-full border border-violet-200 py-1.5 text-center text-xs font-semibold text-violet-700 hover:bg-violet-50"
                        >
                          View Club
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleFollow(club.id)}
                          className="flex-1 rounded-full bg-red-50 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          Unfollow
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Discover more clubs */}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-violet-400">
              More Clubs to Follow
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allVerifiedClubs
                .filter((c) => !isFollowingClub(c.id))
                .map((club) => (
                  <div
                    key={club.id}
                    className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-white p-3"
                  >
                    <img
                      src={club.logo}
                      alt={club.name}
                      className="h-10 w-10 flex-shrink-0 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-violet-900">{club.name}</p>
                      <p className="text-xs text-violet-400">{club.category}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFollow(club.id)}
                      className="flex-shrink-0 rounded-full bg-violet-100 px-3 py-1.5 text-xs font-semibold text-violet-700 hover:bg-violet-600 hover:text-white"
                    >
                      Follow
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Card at bottom */}
      <div className="mt-10 rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 p-6 text-white">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl font-black">
            {user?.name?.[0]}
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm text-violet-100">{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2">
              <GraduationCap size={16} />
              <span>{user?.department}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2">
              <BookOpen size={16} />
              <span>{user?.year}</span>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-2">
              <Users size={16} />
              <span>{followedClubs.length} Clubs</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
