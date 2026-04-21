import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// ── Admin pages ──────────────────────────────────────────────────────────────
import Dashboard from './pages/Dashboard';           // admin event management dashboard
import EventDetails from './pages/EventDetails';     // admin event detail (edit/delete)
import EventForm from './pages/EventForm';

// ── Student pages ─────────────────────────────────────────────────────────────
import EventsPage from './pages/EventsPage';               // student event listing
import EventDetailsPage from './pages/EventDetailsPage';   // student event detail (read-only + register)
import RegistrationPage from './pages/RegistrationPage';   // event registration form
import PaymentPage from './pages/PaymentPage';             // payment

// ── Shared / Auth pages ───────────────────────────────────────────────────────
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import UserManagement from './pages/UserManagement';
import AdminRegistrationsPage from './pages/AdminRegistrationsPage';
import VerifyEmailInfo from './pages/VerifyEmailInfo';

// Redirects already-logged-in users away from /login and /register
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: 'white', padding: '40px' }}>Loading...</div>;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/events'} replace />;
  return children;
}

const AppContent = () => {
  const location = useLocation();
  const hideNavbarRoutes = [
    '/',
    '/register',
    '/login',
    '/profile',
    '/verify-info',
    '/settings',
    '/forgot-password',
    '/reset-password',
  ];

  const shouldHideNavbar =
    hideNavbarRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/profile/');

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main>
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/" element={<Landing />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-info" element={<VerifyEmailInfo />} />
          <Route path="/profile/:id" element={<PublicProfile />} />

          {/* ── Guest only (already-logged-in users are redirected) ─────── */}
          <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

          {/* ── Student portal ─────────────────────────────────────────── */}
          <Route path="/events"          element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
          <Route path="/events/:id"      element={<ProtectedRoute><EventDetailsPage /></ProtectedRoute>} />
          <Route path="/register/:id"    element={<ProtectedRoute><RegistrationPage /></ProtectedRoute>} />
          <Route path="/payment/:id"     element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/profile"         element={<ProtectedRoute><Profile defaultTab="overview" /></ProtectedRoute>} />
          <Route path="/settings"        element={<ProtectedRoute><Profile defaultTab="settings" /></ProtectedRoute>} />

          {/* ── Admin portal ───────────────────────────────────────────── */}
          <Route path="/admin"                  element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path="/admin/events/:id"       element={<AdminRoute><EventDetails /></AdminRoute>} />
          <Route path="/admin/users"            element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/registrations"    element={<AdminRoute><AdminRegistrationsPage /></AdminRoute>} />
          <Route path="/create"                 element={<AdminRoute><EventForm /></AdminRoute>} />
          <Route path="/edit/:id"               element={<AdminRoute><EventForm /></AdminRoute>} />

          {/* ── Fallback ───────────────────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;