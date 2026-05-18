import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import authService from '../../auth/services/authService';
import BookingForm from '../components/BookingForm';
import bookingService, { Booking, CreateBookingRequest } from '../services/bookingService';
import consultationSlotService, { ConsultationSlot } from '../../consultationslots/services/consultationSlotService';

type BookConsultationLocationState = {
  preselectedFacultyId?: number;
  preselectedSlotId?: number;
};

const BookConsultationPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const location = useLocation();
  const locationState = (location.state || {}) as BookConsultationLocationState;

  const [slots, setSlots] = useState<ConsultationSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'Book Consultation | ConsultEase';
  }, []);

  useEffect(() => {
    const loadSlots = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const response = await consultationSlotService.getAll();
        setSlots(response);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError('Slot API is not available in the current backend. Expected /consultation-slots or /slots.');
        } else {
          setError(err?.response?.data?.message || 'Failed to load slots. Please try again.');
        }
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, []);

  const openSlots = useMemo(
    () => slots.filter((slot) => !slot.isBooked),
    [slots]
  );

  const handleBooking = async (payload: CreateBookingRequest) => {
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);
      const createdBooking: Booking = await bookingService.createBooking(payload);

      // Optimistically mark selected slot as booked so users cannot submit duplicate booking.
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === createdBooking.slotId
            ? {
                ...slot,
                isBooked: true,
                bookingId: createdBooking.id,
                consultationStatus: createdBooking.status,
              }
            : slot
        )
      );

      setSuccess('Booking created successfully.');
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      if (err?.response?.status === 404) {
        setError('Booking API is not available in the current backend. Expected POST /bookings.');
      } else if (apiMessage) {
        setError(apiMessage);
      } else {
        setError('Booking failed due to an unexpected error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (user?.role !== 'STUDENT') {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold text-gray-900">Book Consultation</h1>
        <p className="mt-2 text-red-600">Only STUDENT role can create bookings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Consultation</h1>
        <p className="mt-2 text-sm text-gray-600">Select an available consultation slot from faculty.</p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{success} View in <Link to="/dashboard/my-bookings" className="underline font-semibold">My Bookings</Link>.</span>
          </div>
        )}

        <div className="mt-5">
          {loadingSlots ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-amber-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          ) : openSlots.length > 0 ? (
            <BookingForm
              slots={openSlots}
              loading={submitting}
              serverError={error}
              onSubmit={handleBooking}
            />
          ) : (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
              No available consultation slots at the moment. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookConsultationPage;
