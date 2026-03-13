import { Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import LandingPage from './pages/LandingPage';
import LeaderboardPage from './pages/LeaderboardPage';
import LoginPage from './pages/LoginPage';
import MapTrackingPage from './pages/MapTrackingPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import ResourcesPage from './pages/ResourcesPage';
import SettingsPage from './pages/SettingsPage';
import VolunteersPage from './pages/VolunteersPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    <Route
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/volunteers" element={<VolunteersPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/map" element={<MapTrackingPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Routes>
);

export default App;
