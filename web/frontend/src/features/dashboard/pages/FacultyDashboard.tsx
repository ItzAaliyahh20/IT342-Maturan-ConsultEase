import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Settings, BookOpen, ClipboardList } from 'lucide-react';
import authService from '../../auth/services/authService';

const FacultyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage consultation slots and bookings</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/faculty/create-slot')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Create Slot</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">Add Availability</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ClipboardList className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/faculty/consultation-slots')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">My Slots</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">View & Manage</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard/my-bookings')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Student Bookings</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">Review & Respond</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-full">
              <GraduationCap className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate('/dashboard')}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Settings</p>
              <p className="text-lg font-semibold text-gray-900 mt-2">Profile & Password</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
