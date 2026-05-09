import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { ConsultationSlot } from '../../consultationslots/services/consultationSlotService';
import { CreateBookingRequest } from '../services/bookingService';

interface BookingFormProps {
  slots: ConsultationSlot[];
  loading: boolean;
  serverError: string;
  onSubmit: (payload: CreateBookingRequest) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ slots, loading, serverError, onSubmit }) => {
  const [slotId, setSlotId] = useState<number | ''>('');
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!slotId) {
      newErrors.slotId = 'Please select a consultation slot';
    }

    if (!purpose.trim()) {
      newErrors.purpose = 'Please provide a purpose for consultation';
    }

    if (purpose.trim().length < 10) {
      newErrors.purpose = 'Purpose must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      slotId: Number(slotId),
      purpose: purpose.trim()
    });

    // Clear form after submission
    setSlotId('');
    setPurpose('');
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <label htmlFor="slotId" className="block text-sm font-medium text-gray-700">
          Select Consultation Slot *
        </label>
        <select
          id="slotId"
          value={slotId}
          onChange={(e) => {
            setSlotId(e.target.value ? Number(e.target.value) : '');
            setErrors({ ...errors, slotId: '' });
          }}
          disabled={loading}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
        >
          <option value="">-- Select a slot --</option>
          {slots.map((slot) => (
            <option key={slot.id} value={slot.id}>
              {new Date(slot.date).toLocaleDateString()} at{' '}
              {slot.startTime.slice(0, 5)} - Faculty: {slot.facultyName}
            </option>
          ))}
        </select>
        {errors.slotId && <p className="mt-1 text-xs text-red-600">{errors.slotId}</p>}
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
          Purpose of Consultation *
        </label>
        <textarea
          id="purpose"
          value={purpose}
          onChange={(e) => {
            setPurpose(e.target.value);
            setErrors({ ...errors, purpose: '' });
          }}
          disabled={loading}
          placeholder="Describe the topic or issue you'd like to discuss..."
          rows={4}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
        />
        {errors.purpose && <p className="mt-1 text-xs text-red-600">{errors.purpose}</p>}
        <p className="mt-1 text-xs text-gray-500">{purpose.length} characters</p>
      </div>

      <button
        type="submit"
        disabled={loading || slots.length === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Booking...' : 'Book Consultation'}
      </button>

      {slots.length === 0 && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
          No available consultation slots at this time. Please check back later.
        </div>
      )}
    </form>
  );
};

export default BookingForm;
