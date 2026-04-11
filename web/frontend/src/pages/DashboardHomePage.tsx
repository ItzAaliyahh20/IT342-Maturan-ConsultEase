import React, { useEffect, useMemo, useState } from 'react';
import authService from '../auth/authService';
import consultationSlotService, { ConsultationSlot } from '../services/consultationSlotService';
import ConsultationSlotCard from '../components/dashboard/ConsultationSlotCard';

const DashboardHomePage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSlots = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await consultationSlotService.getAll();
        if (!isMounted) {
          return;
        }
        setSlots(data);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const message = err instanceof Error ? err.message : 'Failed to load consultation slots.';
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableSlots = useMemo(() => slots.filter((slot) => !slot.isBooked), [slots]);

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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Available Consultation Slots</h2>
          <span className="text-sm text-gray-500">{availableSlots.length} available</span>
        </div>

        {loading && <p className="text-sm text-gray-600">Loading slots...</p>}

        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && availableSlots.length === 0 && (
          <p className="text-sm text-gray-600">No consultation slots are available right now.</p>
        )}

        {!loading && !error && availableSlots.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {availableSlots.map((slot) => (
              <ConsultationSlotCard key={slot.id} slot={slot} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHomePage;
