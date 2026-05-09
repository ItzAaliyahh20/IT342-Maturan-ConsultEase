import { Routes, Route, Navigate } from 'react-router-dom';

// Auth Feature Imports
import LoginPage from './features/auth/pages/LoginPage';
import AdminLoginPage from './features/auth/pages/AdminLoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import ChangePasswordPage from './features/auth/pages/ChangePasswordPage';
import authService from './features/auth/services/authService';

// Dashboard Feature Imports
import Dashboard from './features/dashboard/pages/Dashboard';
import DashboardHomePage from './features/dashboard/pages/DashboardHomePage';
import FacultyDashboard from './features/dashboard/pages/FacultyDashboard';
import FacultyHomePage from './features/dashboard/pages/FacultyHomePage';

// Bookings Feature Imports
import BookConsultationPage from './features/bookings/pages/BookConsultationPage';
import MyBookingsPage from './features/bookings/pages/MyBookingsPage';

// ConsultationSlots Feature Imports
import SlotsPage from './features/consultationslots/pages/SlotsPage';
import CreateSlotPage from './features/consultationslots/pages/CreateSlotPage';

// Admin Feature Imports
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AddFacultyPage from './features/admin/pages/AddFacultyPage';

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
          path="book-consultation"
          element={
            <StudentProtectedRoute>
              <BookConsultationPage />
            </StudentProtectedRoute>
          }
        />
        <Route path="my-bookings" element={<MyBookingsPage />} />
      </Route>

      <Route
        path="/faculty"
        element={
          <FacultyProtectedRoute>
            <Dashboard />
          </FacultyProtectedRoute>
        }
      >
        <Route index element={<FacultyHomePage />} />
        <Route path="consultation-slots" element={<SlotsPage />} />
        <Route path="create-slot" element={<CreateSlotPage />} />
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
        path="/auth/change-password" 
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
