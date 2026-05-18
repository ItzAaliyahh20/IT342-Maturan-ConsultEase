import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, PlusCircle } from 'lucide-react';
import authService from '../../auth/services/authService';
import SlotTable from '../components/SlotTable';
import consultationSlotService, { ConsultationSlot } from '../services/consultationSlotService';
import bookingService from '../../bookings/services/bookingService';

const SlotsPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const isFaculty = user?.role === 'FACULTY';

  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<number | null>(null);

  const loadSlots = async () => {
    setLoading(true);
    setError('');

    console.log('loadSlots() called');
    try {
      console.log('Calling consultationSlotService.getAll()...');
      const data = await consultationSlotService.getAll();
      console.log('Successfully fetched slots:', data);
      setSlots(data);
    } catch (err: any) {
      console.error('Error loading slots:', err);
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (err?.response?.status === 404) {
        setError('Consultation slot API is not available in the current backend. Expected /consultation-slots or /slots.');
      } else {
        setError(apiMessage || 'Failed to fetch consultation slots. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Consultation Slots | ConsultEase';
    console.log('SlotsPage mounted, calling loadSlots()');
    loadSlots();
  }, []);

  const handleDelete = async (slot: ConsultationSlot) => {
    setError('');

    if (!isFaculty) {
      setError('Only faculty users can delete consultation slots.');
      return;
    }

    try {
      setDeletingId(slot.id);
      await consultationSlotService.remove(slot.id);
      setSlots((prev) => prev.filter((item) => item.id !== slot.id));
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (err?.response?.status === 403) {
        setError('Only faculty users can delete consultation slots.');
      } else if (err?.response?.status === 404) {
        setError('Consultation slot API is not available in the current backend. Expected /consultation-slots/{id} or /slots/{id}.');
      } else {
        setError(apiMessage || 'Unable to delete slot. Booked slots may not be deletable.');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateStatus = async (slot: ConsultationSlot, status: string) => {
    setError('');

    if (!isFaculty) {
      setError('Only faculty users can update consultation status.');
      return;
    }

    if (!slot.bookingId) {
      setError('This slot has no booking to update.');
      return;
    }

    try {
      setUpdatingStatusId(slot.id);
      const updated = await bookingService.updateBooking(slot.bookingId, { status });

      setSlots((prev) =>
        prev.map((item) =>
          item.id === slot.id
            ? {
                ...item,
                consultationStatus: updated.status,
              }
            : item
        )
      );
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (err?.response?.status === 403) {
        setError('Only faculty users can update consultation status.');
      } else {
        setError(apiMessage || 'Failed to update consultation status. Please try again.');
      }
    } finally {
      setUpdatingStatusId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultation Slots</h1>
            <p className="mt-2 text-sm text-gray-600">
              {isFaculty ? 'Create and manage your consultation time slots.' : 'View available consultation slots from faculty.'}
            </p>
          </div>
          {isFaculty && (
            <Link
              to="/faculty/create-slot"
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Create Slot
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block">
              <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          </div>
        ) : slots.length > 0 ? (
          <SlotTable
            slots={slots}
            isFaculty={isFaculty}
            deletingId={deletingId}
            updatingStatusId={updatingStatusId}
            onDelete={handleDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
            No consultation slots available.
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotsPage;
