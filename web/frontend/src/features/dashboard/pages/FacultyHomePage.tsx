import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import authService from '../../auth/services/authService';

const FacultyHomePage: React.FC = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}</h1>
            <p className="mt-2 text-gray-600">You're logged in as Faculty</p>
          </div>
          <div className="p-4 bg-amber-100 rounded-lg">
            <GraduationCap className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Navigation Suggestions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/faculty/create-slot')}
          className="text-left p-4 border border-gray-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
        >
          <p className="font-semibold text-gray-900">Create Consultation Slot</p>
          <p className="text-sm text-gray-600 mt-1">Add your availability for student consultations</p>
          <div className="mt-3 flex items-center gap-1 text-amber-600">
            <span className="text-sm font-medium">Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        <button
          onClick={() => navigate('/faculty/consultation-slots')}
          className="text-left p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <p className="font-semibold text-gray-900">View Your Slots</p>
          <p className="text-sm text-gray-600 mt-1">Manage and monitor all consultation slots</p>
          <div className="mt-3 flex items-center gap-1 text-green-600">
            <span className="text-sm font-medium">Manage</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        <button
          onClick={() => navigate('/dashboard/my-bookings')}
          className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <p className="font-semibold text-gray-900">Student Booking Requests</p>
          <p className="text-sm text-gray-600 mt-1">Review and respond to student bookings</p>
          <div className="mt-3 flex items-center gap-1 text-blue-600">
            <span className="text-sm font-medium">Review</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>

        <button
          onClick={() => navigate('/auth/change-password')}
          className="text-left p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
        >
          <p className="font-semibold text-gray-900">Change Password</p>
          <p className="text-sm text-gray-600 mt-1">Update your account security</p>
          <div className="mt-3 flex items-center gap-1 text-purple-600">
            <span className="text-sm font-medium">Update</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default FacultyHomePage;
