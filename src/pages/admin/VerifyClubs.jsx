import { useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useClubs } from '../../context/ClubContext';

const tabs = ['Pending', 'Verified', 'Rejected'];

export default function VerifyClubs() {
  const { logout } = useAuth();
  const { clubs, updateClubStatus } = useClubs();
  const [activeTab, setActiveTab] = useState('Pending');
  const [selectedClub, setSelectedClub] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [processing, setProcessing] = useState(false);

  const filteredClubs = useMemo(
    () => clubs.filter((club) => club.status === activeTab),
    [activeTab, clubs],
  );

  const handleAction = async (status) => {
    if (!selectedClub) return;
    setProcessing(true);
    try {
      await updateClubStatus(selectedClub.id, status, status === 'Rejected' ? rejectionNote : '');
      setSelectedClub(null);
      setRejectionNote('');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar role="admin" onLogout={logout} />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Review</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Verify clubs</h1>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {filteredClubs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                No clubs in this verification stage.
              </div>
            ) : (
              filteredClubs.map((club) => (
                <div key={club.id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{club.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{club.category} • {club.coordinator_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={club.status} />
                    <button type="button" onClick={() => setSelectedClub(club)} className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      View details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedClub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-900">Review: {selectedClub.name}</h3>
              <button type="button" onClick={() => setSelectedClub(null)} className="text-slate-500">Close</button>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-800">Category:</span> {selectedClub.category}</p>
              <p><span className="font-semibold text-slate-800">Description:</span> {selectedClub.description}</p>
              <p><span className="font-semibold text-slate-800">Faculty coordinator:</span> {selectedClub.faculty_coordinator}</p>
              <p><span className="font-semibold text-slate-800">Student coordinator:</span> {selectedClub.student_coordinator}</p>
              <p><span className="font-semibold text-slate-800">Official email:</span> {selectedClub.email}</p>
              <p><span className="font-semibold text-slate-800">Identification details:</span> {selectedClub.identification_details}</p>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Rejection note</label>
                <textarea
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  rows="3"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none focus:border-red-300 focus:ring-4 focus:ring-red-100"
                  placeholder="Add a note for rejected clubs..."
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button type="button" disabled={processing} onClick={() => handleAction('Verified')} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                {processing ? 'Processing…' : 'Verify'}
              </button>
              <button type="button" disabled={processing} onClick={() => handleAction('Rejected')} className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50">
                {processing ? 'Processing…' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
