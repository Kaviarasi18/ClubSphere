import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ClubProvider } from './context/ClubContext';
import { EventProvider } from './context/EventContext';
import ClubDetails from './pages/ClubDetails';
import EventDetails from './pages/EventDetails';
import EventsPage from './pages/Events';
import ExploreClubs from './pages/ExploreClubs';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import ClubDirectory from './pages/admin/ClubDirectory';
import CreateClub from './pages/admin/CreateClub';
import VerifyClubs from './pages/admin/VerifyClubs';
import CoordinatorDashboard from './pages/coordinator/CoordinatorDashboard';
import CreateEvent from './pages/coordinator/CreateEvent';
import ManageEvents from './pages/coordinator/ManageEvents';
import MyClub from './pages/coordinator/MyClub';
import StudentDashboard from './pages/student/StudentDashboard';

function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === 'admin' ? '/admin' : user.role === 'coordinator' ? '/coordinator' : '/student';
    return <Navigate to={fallback} replace />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/clubs" element={<ExploreClubs />} />
      <Route path="/clubs/:clubId" element={<ClubDetails />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'coordinator' ? '/coordinator' : '/student'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'coordinator' ? '/coordinator' : '/student'} replace /> : <Register />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/create-club" element={<ProtectedRoute allowedRoles={['admin']}><CreateClub /></ProtectedRoute>} />
      <Route path="/admin/verify-clubs" element={<ProtectedRoute allowedRoles={['admin']}><VerifyClubs /></ProtectedRoute>} />
      <Route path="/admin/club-directory" element={<ProtectedRoute allowedRoles={['admin']}><ClubDirectory /></ProtectedRoute>} />

      <Route path="/coordinator" element={<ProtectedRoute allowedRoles={['coordinator']}><CoordinatorDashboard /></ProtectedRoute>} />
      <Route path="/coordinator/create-event" element={<ProtectedRoute allowedRoles={['coordinator']}><CreateEvent /></ProtectedRoute>} />
      <Route path="/coordinator/manage-events" element={<ProtectedRoute allowedRoles={['coordinator']}><ManageEvents /></ProtectedRoute>} />
      <Route path="/coordinator/my-club" element={<ProtectedRoute allowedRoles={['coordinator']}><MyClub /></ProtectedRoute>} />

      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClubProvider>
          <EventProvider>
            <div className="min-h-screen bg-transparent text-violet-950">
              <Navbar />
              <AppRoutes />
              <Footer />
            </div>
          </EventProvider>
        </ClubProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
