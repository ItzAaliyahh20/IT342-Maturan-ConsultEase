import React from 'react';
import authService from '../auth/authService';

const DashboardHomePage: React.FC = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{user?.fullName ? `, ${user.fullName}` : ''}!
        </h1>
        <p className="mt-2 text-gray-600">Manage your consultations and track your booking status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Role</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{user?.role || 'UNKNOWN'}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Email</p>
          <p className="mt-1 text-sm font-medium text-gray-900 break-all">{user?.email}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Provider</p>
          <p className="mt-1 text-lg font-semibold text-gray-900">{user?.provider || 'LOCAL'}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
