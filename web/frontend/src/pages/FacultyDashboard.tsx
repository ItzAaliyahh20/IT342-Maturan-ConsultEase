import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import authService from '../auth/authService';
import FacultySidebar from '../components/faculty/FacultySidebar';

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'FACULTY') {
      navigate('/dashboard');
      return;
    }
    document.title = 'Faculty Dashboard | ConsultEase';
  }, [navigate, user]);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      navigate('/login');
    }
  };

  if (!user || user.role !== 'FACULTY') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-hero">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Consult<span className="text-amber-500">Ease</span>
              </span>
            </div>

            <div className="text-right leading-tight">
              <p className="text-xs text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        <FacultySidebar onLogout={handleLogout} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacultyDashboard;
