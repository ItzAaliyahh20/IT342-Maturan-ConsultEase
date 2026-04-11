import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import authService from '../auth/authService';
import BookingForm from '../components/dashboard/BookingForm';
import bookingService, { Booking, CreateBookingRequest, Slot } from '../services/bookingService';

const BookConsultationPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [slots, setSlots] = useState<Slot[]>([]);
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
        const response = await bookingService.getSlots();
        setSlots(response);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError('Slot API is not available in the current backend. Expected /slots, /consultation-slots, or /bookings/slots.');
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
    () => slots.filter((slot) => !bookingService.isSlotBooked(slot)),
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
                status: 'BOOKED',
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
        <p className="mt-2 text-sm text-gray-600">
          Choose an available slot and provide the purpose of your consultation.
        </p>

        {loadingSlots ? (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            <p className="mt-4 text-sm text-gray-500">Available slots: {openSlots.length}</p>
            <div className="mt-4">
              <BookingForm
                slots={slots}
                userRole={user?.role}
                loading={submitting}
                serverError={error}
                onSubmit={handleBooking}
              />
            </div>
          </>
        )}

        {success && (
          <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700 flex gap-2">
            <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{success} View it under <Link to="/dashboard/bookings" className="underline font-semibold">My Bookings</Link>.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookConsultationPage;
