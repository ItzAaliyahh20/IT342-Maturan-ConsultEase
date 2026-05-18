import React from 'react';
import { Calendar, Clock, User, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';

interface Booking {
  id: number;
  slotId?: number;
  studentId?: number;
  facultyId?: number;
  purpose?: string;
  status?: string;
  consultationStatus?: string;
  date?: string;
  startTime?: string;
  student?: { id: number; fullName: string; email: string };
  faculty?: { id: number; fullName: string; email: string };
  createdAt?: string;
}

interface BookingListProps {
  bookings: Booking[];
  userRole?: string;
}

const BookingList: React.FC<BookingListProps> = ({ bookings, userRole }) => {
  const getStatusBadge = (status?: string) => {
    const normalizedStatus = (status || '').toUpperCase();

    switch (normalizedStatus) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="h-3 w-3" />
            Pending
          </span>
        );
      case 'BOOKED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Loader2 className="h-3 w-3" />
            Booked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-center text-sm text-yellow-700">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map((booking) => (
        <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 space-y-2">
              {/* Student/Faculty Info */}
              {userRole === 'FACULTY' && booking.student && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{booking.student.fullName}</span>
                  <span className="text-gray-600">({booking.student.email})</span>
                </div>
              )}

              {userRole === 'STUDENT' && booking.faculty && (
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{booking.faculty.fullName}</span>
                  <span className="text-gray-600">({booking.faculty.email})</span>
                </div>
              )}

              {/* Purpose */}
              {booking.purpose && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Purpose:</span> {booking.purpose}
                </p>
              )}

              {/* Date/Time */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-600">
                {booking.date && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(booking.date).toLocaleDateString()}
                  </div>
                )}
                {booking.startTime && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {booking.startTime.slice(0, 5)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3">
              {getStatusBadge(booking.status || booking.consultationStatus)}
              
              {/* Faculty Actions - Only show if user is faculty and status is PENDING */}
              {userRole === 'FACULTY' && booking.consultationStatus?.toUpperCase() === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingList;
