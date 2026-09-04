import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import HomePage from './pages/HomePage.jsx';
import CustomerRegisterPage from './pages/CustomerRegisterPage.jsx';
import CustomerLoginPage from './pages/CustomerLoginPage.jsx';
import ApplicationPage from './pages/ApplicationPage.jsx';
import ApplicationSuccessPage from './pages/ApplicationSuccessPage.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

export default function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<CustomerRegisterPage />} />
        <Route path="/login" element={<CustomerLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/application"
          element={
            <ProtectedRoute role="CUSTOMER">
              <ApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application/success"
          element={
            <ProtectedRoute role="CUSTOMER">
              <ApplicationSuccessPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
