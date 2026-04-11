import React, { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { CreateBookingRequest } from '../../services/bookingService';
import bookingService from '../../services/bookingService';
import { ConsultationSlot } from '../../services/consultationSlotService';

interface BookingFormProps {
  slots: ConsultationSlot[];
  userRole?: string;
  loading?: boolean;
  serverError?: string;
  preselectedFacultyId?: number;
  preselectedSlotId?: number;
  onSubmit: (payload: CreateBookingRequest) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({
  slots,
  userRole,
  loading = false,
  serverError,
  preselectedFacultyId,
  preselectedSlotId,
  onSubmit,
}) => {
  const [facultyId, setFacultyId] = useState(preselectedFacultyId ? String(preselectedFacultyId) : '');
  const [slotId, setSlotId] = useState(preselectedSlotId ? String(preselectedSlotId) : '');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  const facultyOptions = useMemo(() => {
    const unique = new Map<number, string>();
    slots.forEach((slot) => {
      if (!bookingService.isSlotBooked(slot) && Number.isFinite(slot.facultyId) && slot.facultyId > 0) {
        unique.set(slot.facultyId, slot.facultyName || `Faculty #${slot.facultyId}`);
      }
    });
    return Array.from(unique.entries()).map(([id, name]) => ({ id, name }));
  }, [slots]);

  const slotOptions = useMemo(() => {
    if (!facultyId) {
      return [];
    }

    return slots
      .filter((slot) => String(slot.facultyId) === facultyId)
      .map((slot) => ({
        ...slot,
        booked: bookingService.isSlotBooked(slot),
      }));
  }, [slots, facultyId]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (userRole !== 'STUDENT') {
      setError('Only students can create bookings.');
      return;
    }

    if (!slotId) {
      setError('Please select a slot.');
      return;
    }

    const selectedSlot = slots.find((slot) => String(slot.id) === slotId);
    if (!selectedSlot) {
      setError('Invalid slot. Please choose an existing slot.');
      return;
    }

    if (bookingService.isSlotBooked(selectedSlot)) {
      setError('Selected slot is already booked. Please choose another slot.');
      return;
    }

    if (!purpose.trim()) {
      setError('Purpose is required.');
      return;
    }

    await onSubmit({
      slotId: Number(slotId),
      purpose: purpose.trim(),
    });

    setPurpose('');
    if (!preselectedSlotId) {
      setSlotId('');
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {(error || serverError) && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error || serverError}</span>
        </div>
      )}

      <div>
        <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700">
          Faculty
        </label>
        <select
          id="facultyId"
          value={facultyId}
          onChange={(event) => {
            setFacultyId(event.target.value);
            setSlotId('');
          }}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading || Boolean(preselectedFacultyId)}
          required
        >
          <option value="">Select a faculty</option>
          {facultyOptions.map((faculty) => (
            <option key={faculty.id} value={faculty.id}>
              {faculty.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">
          Available Slot
        </label>
        <select
          id="slotId"
          value={slotId}
          onChange={(event) => setSlotId(event.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading || !facultyId}
          required
        >
          <option value="">Select a slot</option>
          {slotOptions.map((slot) => (
            <option key={slot.id} value={slot.id} disabled={slot.booked}>
              {`${slot.date} at ${slot.startTime} (${slot.duration} min)${slot.booked ? ' (Booked)' : ''}`}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Purpose
        </label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          placeholder="Tell your faculty what you need help with"
          className="mt-1.5 min-h-[120px] w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading}
          required
        />
      </div>

      <button
        type="submit"
        className="gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity px-5 py-2.5 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Booking...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookingForm;
