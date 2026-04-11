import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { CreateConsultationSlotRequest } from '../../services/consultationSlotService';

interface SlotFormProps {
  loading?: boolean;
  serverError?: string;
  isFaculty: boolean;
  onSubmit: (payload: CreateConsultationSlotRequest) => Promise<void>;
}

const SlotForm: React.FC<SlotFormProps> = ({
  loading = false,
  serverError,
  isFaculty,
  onSubmit,
}) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isFaculty) {
      setError('Only faculty users can create consultation slots.');
      return;
    }

    if (!date) {
      setError('Date is required.');
      return;
    }

    if (!startTime) {
      setError('Start time is required.');
      return;
    }

    const parsedDuration = Number(duration);
    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      setError('Duration must be greater than 0.');
      return;
    }

    await onSubmit({
      date,
      startTime,
      duration: parsedDuration,
    });

    setDate('');
    setStartTime('');
    setDuration('30');
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
        <label htmlFor="slotDate" className="block text-sm font-medium text-gray-700">Date</label>
        <input
          id="slotDate"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
        <input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(event) => setStartTime(event.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading}
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
        <input
          id="duration"
          type="number"
          min={1}
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber focus:border-transparent"
          disabled={loading}
          required
        />
      </div>

      <button
        type="submit"
        className="gradient-amber text-white font-semibold shadow-amber border-0 hover:opacity-90 transition-opacity px-5 py-2.5 rounded-md disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Creating...' : 'Create Slot'}
      </button>
    </form>
  );
};

export default SlotForm;
