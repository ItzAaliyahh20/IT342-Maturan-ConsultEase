import React from 'react';
import { Trash2, CheckCircle2, XCircle, Clock, Calendar, User, Loader2 } from 'lucide-react';
import { ConsultationSlot } from '../services/consultationSlotService';

interface SlotTableProps {
  slots: ConsultationSlot[];
  isFaculty: boolean;
  deletingId: number | null;
  updatingStatusId: number | null;
  onDelete: (slot: ConsultationSlot) => void;
  onUpdateStatus: (slot: ConsultationSlot, status: string) => void;
}

const SlotTable: React.FC<SlotTableProps> = ({
  slots,
  isFaculty,
  deletingId,
  updatingStatusId,
  onDelete,
  onUpdateStatus
}) => {
  const getStatusBadge = (slot: ConsultationSlot) => {
    const booked = slot.isBooked || slot.consultationStatus?.toUpperCase() === 'BOOKED';

    if (booked) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <Loader2 className="h-3 w-3" />
          Booked
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle2 className="h-3 w-3" />
        Available
      </span>
    );
  };

  if (slots.length === 0) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700">
        No consultation slots available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Duration</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Faculty</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            {isFaculty && <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {slots.map((slot) => (
            <tr key={slot.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {new Date(slot.date).toLocaleDateString()}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {slot.startTime.slice(0, 5)}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{slot.duration} min</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  {slot.facultyName}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">{getStatusBadge(slot)}</td>
              {isFaculty && (
                <td className="px-4 py-3 text-sm text-right space-x-2">
                  {slot.isBooked && slot.bookingId && (
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onUpdateStatus(slot, 'APPROVED')}
                        disabled={updatingStatusId === slot.id}
                        className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                        title="Approve booking"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onUpdateStatus(slot, 'REJECTED')}
                        disabled={updatingStatusId === slot.id}
                        className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors"
                        title="Reject booking"
                      >
                        ✗
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => onDelete(slot)}
                    disabled={deletingId === slot.id}
                    className="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors inline-flex items-center gap-1"
                    title="Delete slot"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SlotTable;
