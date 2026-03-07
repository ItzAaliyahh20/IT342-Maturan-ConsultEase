import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Lock, Mail, Shield } from 'lucide-react';
import AuthLayout from './AuthLayout';
import authService from './authService';

// Set page title with shield icon
document.title = 'Admin Portal - ConsultEase';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const user = authService.getCurrentUser();
      if (user?.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        // If logged in but not admin, redirect to regular dashboard
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      
      // Verify user is an admin
      if (response.user.role !== 'ADMIN') {
        setError('Access denied. Administrator credentials required.');
        authService.clearAuth();
        setLoading(false);
        return;
      }

      // Store auth data
      authService.setAuth(response);
      
      // Redirect to admin dashboard
      window.location.href = '/admin';
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Handle validation errors
        const errors = err.response.data.errors;
        setError(Object.values(errors).flat().join(', '));
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout isLogin={true} isCentered={true}>
      {/* Admin Portal Header with Shield */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Shield className="h-8 w-8 text-amber" />
        <h1 className="mb-0 text-2xl font-bold text-gray-900">Admin Portal</h1>
      </div>
      <p className="mb-8 text-muted-foreground text-center">Sign in to continue to administration</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="text"
              placeholder="admin@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative mt-1.5">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
              minLength={6}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity gap-2 flex items-center justify-center py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Authenticating...
            </>
          ) : (
            <>
              Sign In to Admin
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-center text-xs text-gray-500">
          <a href="/login" className="text-amber hover:underline">
            ← Return to user login
          </a>
        </p>
      </div>
    </AuthLayout>
  );
};

export default AdminLoginPage;
