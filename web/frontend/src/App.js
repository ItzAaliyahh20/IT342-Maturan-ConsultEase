import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import AdminLoginPage from './auth/AdminLoginPage';
import RegisterPage from './auth/RegisterPage';
import ChangePasswordPage from './auth/ChangePasswordPage';
import Dashboard from './pages/Dashboard';
import DashboardHomePage from './pages/DashboardHomePage';
import AdminDashboard from './pages/AdminDashboard';
import AddFacultyPage from './pages/AddFacultyPage';
import BookConsultationPage from './pages/BookConsultationPage';
import MyBookingsPage from './pages/MyBookingsPage';
import FacultyDashboard from './pages/FacultyDashboard';
import FacultyHomePage from './pages/FacultyHomePage';
import SlotsPage from './pages/SlotsPage';
import CreateSlotPage from './pages/CreateSlotPage';
import authService from './auth/authService';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Protected Route wrapper component
const AdminProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/auth/admin/login" replace />;
  }
  const user = authService.getCurrentUser();
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const StudentProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getCurrentUser();
  if (!user || user.role !== 'STUDENT') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const FacultyProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getCurrentUser();
  if (!user || user.role !== 'FACULTY') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Admin Login - Hidden route, not linked from public areas */}
      <Route path="/auth/admin/login" element={<AdminLoginPage />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route
          path="book"
          element={
            <StudentProtectedRoute>
              <BookConsultationPage />
            </StudentProtectedRoute>
          }
        />
        <Route path="bookings" element={<MyBookingsPage />} />
      </Route>

      <Route
        path="/faculty"
        element={
          <FacultyProtectedRoute>
            <FacultyDashboard />
          </FacultyProtectedRoute>
        }
      >
        <Route index element={<FacultyHomePage />} />
        <Route path="consultation-slots" element={<SlotsPage />} />
        <Route path="consultation-slots/create" element={<CreateSlotPage />} />
      </Route>

      <Route
        path="/consultation-slots"
        element={
          <ProtectedRoute>
            <SlotsPage />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes - Protected and role-specific */}
      <Route 
        path="/admin" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/admin/faculty/add" 
        element={
          <AdminProtectedRoute>
            <AddFacultyPage />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/change-password" 
        element={
          <ProtectedRoute>
            <ChangePasswordPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirects */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
