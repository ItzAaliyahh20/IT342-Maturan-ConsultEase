import React from 'react';
import authService from '../auth/authService';

const FacultyHomePage: React.FC = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user?.fullName ? `, ${user.fullName}` : ''}!
        </h1>
        <p className="mt-2 text-gray-600">Manage your consultation slots and availability.</p>
      </div>

      <div className="rounded-lg bg-white p-5 shadow">
        <p className="text-sm text-gray-500">Role</p>
        <p className="mt-1 text-lg font-semibold text-gray-900">{user?.role || 'UNKNOWN'}</p>
      </div>
    </div>
  );
};

export default FacultyHomePage;
