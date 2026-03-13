import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageSkeleton from './components/loader/PageSkeleton';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';

const VolunteerDashboardPage = lazy(() => import('./pages/VolunteerDashboardPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const HelpRequestsPage = lazy(() => import('./pages/HelpRequestsPage'));
const MapTrackingPage = lazy(() => import('./pages/MapTrackingPage'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const withSuspense = (Component) => (
  <Suspense fallback={<PageSkeleton />}>
    <Component />
  </Suspense>
);

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route element={<ProtectedRoute allowedRoles={['volunteer']} />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={withSuspense(VolunteerDashboardPage)} />
        <Route path="/events" element={withSuspense(EventsPage)} />
        <Route path="/help-requests" element={withSuspense(HelpRequestsPage)} />
        <Route path="/map" element={withSuspense(MapTrackingPage)} />
        <Route path="/leaderboard" element={withSuspense(LeaderboardPage)} />
        <Route path="/ai" element={withSuspense(AIInsightsPage)} />
        <Route path="/profile" element={withSuspense(ProfilePage)} />
        <Route path="/settings" element={withSuspense(SettingsPage)} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
