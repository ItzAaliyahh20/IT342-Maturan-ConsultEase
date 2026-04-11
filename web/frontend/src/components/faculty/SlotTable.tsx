import React from 'react';
import { ConsultationSlot } from '../../services/consultationSlotService';

interface SlotTableProps {
  slots: ConsultationSlot[];
  isFaculty: boolean;
  deletingId?: number | null;
  onDelete?: (slot: ConsultationSlot) => Promise<void>;
}

const SlotTable: React.FC<SlotTableProps> = ({
  slots,
  isFaculty,
  deletingId,
  onDelete,
}) => {
  if (slots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
        No consultation slots found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Start Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duration</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
            {isFaculty && (
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {slots.map((slot) => (
            <tr key={slot.id}>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{slot.date}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{slot.startTime}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{slot.duration} min</td>
              <td className="px-4 py-3 text-sm">
                {slot.isBooked ? (
                  <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">Booked</span>
                ) : (
                  <span className="inline-flex rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Available</span>
                )}
              </td>
              {isFaculty && (
                <td className="px-4 py-3 text-sm">
                  <button
                    onClick={() => onDelete?.(slot)}
                    className="rounded-md border border-red-200 px-3 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={Boolean(slot.isBooked) || deletingId === slot.id}
                    title={slot.isBooked ? 'Booked slots cannot be deleted' : 'Delete slot'}
                  >
                    {deletingId === slot.id ? 'Deleting...' : 'Delete'}
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
