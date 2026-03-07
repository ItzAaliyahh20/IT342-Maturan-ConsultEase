import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import AdminLoginPage from './auth/AdminLoginPage';
import RegisterPage from './auth/RegisterPage';
import ChangePasswordPage from './auth/ChangePasswordPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddFacultyPage from './pages/AddFacultyPage';
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
