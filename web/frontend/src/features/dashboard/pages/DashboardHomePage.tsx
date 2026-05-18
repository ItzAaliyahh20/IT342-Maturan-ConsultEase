import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, BookOpen } from 'lucide-react';
import authService from '../../auth/services/authService';

const DashboardHomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}</h1>
        <p className="mt-2 text-gray-600">Manage your consultations and schedule</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/book-consultation')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Book Consultation</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Start Now</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/my-bookings')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">View All</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/faculty/consultation-slots')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">View Slots</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Available</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
