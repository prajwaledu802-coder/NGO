import { Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/admin" element={<Navigate to="/login?role=admin" replace />} />
    <Route path="/volunteer" element={<Navigate to="/login?role=volunteer" replace />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="*" element={<LandingPage />} />
  </Routes>
);

export default App;
