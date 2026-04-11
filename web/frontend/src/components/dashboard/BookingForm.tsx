import React, { useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { CreateBookingRequest, Slot } from '../../services/bookingService';
import bookingService from '../../services/bookingService';

interface BookingFormProps {
  slots: Slot[];
  userRole?: string;
  loading?: boolean;
  serverError?: string;
  onSubmit: (payload: CreateBookingRequest) => Promise<void>;
}

const BookingForm: React.FC<BookingFormProps> = ({
  slots,
  userRole,
  loading = false,
  serverError,
  onSubmit,
}) => {
  const [slotId, setSlotId] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');

  const slotOptions = useMemo(() => slots.map((slot) => ({
    ...slot,
    booked: bookingService.isSlotBooked(slot),
  })), [slots]);

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
    setSlotId('');
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
        <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">
          Slot ID
        </label>
        <select
          id="slotId"
          value={slotId}
          onChange={(event) => setSlotId(event.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading}
          required
        >
          <option value="">Select a slot</option>
          {slotOptions.map((slot) => (
            <option key={slot.id} value={slot.id} disabled={slot.booked}>
              {`Slot #${slot.id}${slot.booked ? ' (Booked)' : ''}`}
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
