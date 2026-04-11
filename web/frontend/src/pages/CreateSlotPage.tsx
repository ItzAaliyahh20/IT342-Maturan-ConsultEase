import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import authService from '../auth/authService';
import SlotForm from '../components/faculty/SlotForm';
import consultationSlotService, { CreateConsultationSlotRequest } from '../services/consultationSlotService';

const CreateSlotPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Create Consultation Slot | ConsultEase';
  }, []);

  const handleCreate = async (payload: CreateConsultationSlotRequest) => {
    setError('');
    setSuccess('');

    if (user?.role !== 'FACULTY') {
      setError('Only faculty users can create consultation slots.');
      return;
    }

    try {
      setLoading(true);
      await consultationSlotService.create(payload);
      setSuccess('Consultation slot created successfully.');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (err?.response?.status === 403) {
        setError('Only faculty users can create consultation slots.');
      } else if (err?.response?.status === 404) {
        setError('Consultation slot API is not available in the current backend. Expected /consultation-slots or /slots.');
      } else {
        setError(apiMessage || 'Failed to create consultation slot. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Consultation Slot</h1>
        <p className="mt-2 text-sm text-gray-600">Set your consultation availability for students.</p>

        <div className="mt-5">
          <SlotForm
            isFaculty={user?.role === 'FACULTY'}
            loading={loading}
            serverError={error}
            onSubmit={handleCreate}
          />
        </div>

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{success} View all in <Link to="/faculty/consultation-slots" className="underline font-semibold">Consultation Slots</Link>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSlotPage;
