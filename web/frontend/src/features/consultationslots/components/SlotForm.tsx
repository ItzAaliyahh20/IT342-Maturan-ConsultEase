import React, { useState } from 'react';
import { AlertCircle, Send } from 'lucide-react';
import { CreateConsultationSlotRequest } from '../services/consultationSlotService';

interface SlotFormProps {
  isFaculty: boolean;
  loading: boolean;
  serverError: string;
  onSubmit: (payload: CreateConsultationSlotRequest) => void;
}

const SlotForm: React.FC<SlotFormProps> = ({ isFaculty, loading, serverError, onSubmit }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('30');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!date) {
      newErrors.date = 'Please select a date';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = 'Date must be in the future';
      }
    }

    if (!startTime) {
      newErrors.startTime = 'Please select a start time';
    }

    if (!duration || parseInt(duration) < 15) {
      newErrors.duration = 'Duration must be at least 15 minutes';
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
      date,
      startTime: `${startTime}:00`,
      duration: parseInt(duration)
    });

    // Clear form after submission
    setDate('');
    setStartTime('');
    setDuration('30');
    setErrors({});
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isFaculty && (
        <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
          Only faculty users can create consultation slots.
        </div>
      )}

      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Date *
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setErrors({ ...errors, date: '' });
          }}
          disabled={loading || !isFaculty}
          min={today}
          className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
        />
        {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time *
          </label>
          <input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
              setErrors({ ...errors, startTime: '' });
            }}
            disabled={loading || !isFaculty}
            className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
          />
          {errors.startTime && <p className="mt-1 text-xs text-red-600">{errors.startTime}</p>}
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes) *
          </label>
          <select
            id="duration"
            value={duration}
            onChange={(e) => {
              setDuration(e.target.value);
              setErrors({ ...errors, duration: '' });
            }}
            disabled={loading || !isFaculty}
            className="mt-1.5 w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
          {errors.duration && <p className="mt-1 text-xs text-red-600">{errors.duration}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !isFaculty}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-md hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="h-4 w-4" />
        {loading ? 'Creating slot...' : 'Create Consultation Slot'}
      </button>
    </form>
  );
};

export default SlotForm;
