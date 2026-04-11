import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, PlusCircle } from 'lucide-react';
import authService from '../auth/authService';
import SlotTable from '../components/faculty/SlotTable';
import consultationSlotService, { ConsultationSlot } from '../services/consultationSlotService';

const SlotsPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const isFaculty = user?.role === 'FACULTY';

  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadSlots = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await consultationSlotService.getAll();
      setSlots(data);
    } catch (err: any) {
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

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Consultation Slots</h1>
            <p className="mt-2 text-sm text-gray-600">All authenticated users can view available and booked slots.</p>
          </div>

          {isFaculty && (
            <Link
              to="/faculty/consultation-slots/create"
              className="inline-flex items-center gap-2 rounded-md gradient-amber text-white px-4 py-2 text-sm font-semibold shadow-amber hover:opacity-90 transition-opacity"
            >
              <PlusCircle className="h-4 w-4" />
              Create Slot
            </Link>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
            </div>
          ) : (
            <SlotTable
              slots={slots}
              isFaculty={isFaculty}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotsPage;
