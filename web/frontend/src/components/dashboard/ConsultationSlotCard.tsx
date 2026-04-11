import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Clock3, User } from 'lucide-react';
import { ConsultationSlot } from '../../services/consultationSlotService';

interface ConsultationSlotCardProps {
  slot: ConsultationSlot;
}

const ConsultationSlotCard: React.FC<ConsultationSlotCardProps> = ({ slot }) => {
  const navigate = useNavigate();

  const handleBook = () => {
    navigate('/dashboard/book', {
      state: {
        preselectedFacultyId: slot.facultyId,
        preselectedSlotId: slot.id,
      },
    });
  };

  return (
    <div className="rounded-lg bg-white p-5 shadow border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">Faculty</p>
          <p className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            {slot.facultyName}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
            slot.isBooked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {slot.isBooked ? 'Booked' : 'Available'}
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-700">
        <p className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-500" />
          {slot.date}
        </p>
        <p className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-gray-500" />
          {slot.startTime} · {slot.duration} min
        </p>
      </div>

      <button
        type="button"
        onClick={handleBook}
        disabled={slot.isBooked}
        className="mt-5 w-full gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity py-2.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Book Consultation
      </button>
    </div>
  );
};

export default ConsultationSlotCard;
