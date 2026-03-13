import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import PageSkeleton from './components/loader/PageSkeleton';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';

const AdminDashboardPage = lazy(() => import('./pages/DashboardPage'));
const VolunteersPage = lazy(() => import('./pages/VolunteersPage'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const MapTrackingPage = lazy(() => import('./pages/MapTrackingPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const VolunteerDetailsPage = lazy(() => import('./pages/VolunteerDetailsPage'));

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

    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={withSuspense(AdminDashboardPage)} />
        <Route path="/volunteers" element={withSuspense(VolunteersPage)} />
        <Route path="/volunteers/:id" element={withSuspense(VolunteerDetailsPage)} />
        <Route path="/events" element={withSuspense(EventsPage)} />
        <Route path="/resources" element={withSuspense(ResourcesPage)} />
        <Route path="/map-tracking" element={withSuspense(MapTrackingPage)} />
        <Route path="/analytics" element={withSuspense(AnalyticsPage)} />
        <Route path="/settings" element={withSuspense(SettingsPage)} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
