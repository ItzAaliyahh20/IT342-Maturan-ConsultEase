import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import authService from '../auth/authService';
import BookingList from '../components/dashboard/BookingList';
import bookingService, { Booking } from '../services/bookingService';

const MyBookingsPage: React.FC = () => {
  const user = authService.getCurrentUser();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'My Bookings | ConsultEase';
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError('');

      try {
        const allBookings = await bookingService.getBookings();
        setBookings(allBookings);
      } catch (err: any) {
        const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
        setError(apiMessage || 'Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Defensive frontend filtering in case backend sends mixed records.
  const visibleBookings = useMemo(() => {
    if (!user) {
      return [];
    }

    if (user.role === 'STUDENT') {
      return bookings.filter((booking) => {
        if (booking.student?.id != null && user.id != null) {
          return booking.student.id === user.id;
        }
        if (booking.studentId != null && user.id != null) {
          return booking.studentId === user.id;
        }
        if (booking.student?.email) {
          return booking.student.email === user.email;
        }
        return true;
      });
    }

    if (user.role === 'FACULTY') {
      return bookings.filter((booking) => {
        if (booking.faculty?.id != null && user.id != null) {
          return booking.faculty.id === user.id;
        }
        if (booking.facultyId != null && user.id != null) {
          return booking.facultyId === user.id;
        }
        if (booking.faculty?.email) {
          return booking.faculty.email === user.email;
        }
        return true;
      });
    }

    return [];
  }, [bookings, user]);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-sm text-gray-600">
          {user?.role === 'FACULTY'
            ? 'Showing bookings assigned to you.'
            : 'Showing bookings created by you.'}
        </p>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5">
          <BookingList bookings={visibleBookings} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default MyBookingsPage;
