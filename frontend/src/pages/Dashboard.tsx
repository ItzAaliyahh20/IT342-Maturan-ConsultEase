import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, GraduationCap } from 'lucide-react';
import authService from '../auth/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<ReturnType<typeof authService.getCurrentUser>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // Not authenticated, redirect to login
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Consult<span className="text-amber-500">Ease</span>
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">{user?.fullName}</span>
                <span className="text-xs text-gray-500">({user?.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome{user?.fullName ? `, ${user.fullName}` : ''}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* User Info Card */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Account Information
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-xs text-gray-500">Email:</span>
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Role:</span>
                  <p className="text-sm font-medium text-gray-900">{user?.role}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Provider:</span>
                  <p className="text-sm font-medium text-gray-900 capitalize">{user?.provider}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                  View Available Faculty
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                  My Bookings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                  Profile Settings
                </button>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Announcements
              </h2>
              <p className="text-sm text-gray-600">
                No new announcements at this time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
