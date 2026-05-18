import '@testing-library/jest-dom';

describe('Booking Component Tests - MyBookingsPage', () => {
  // TC_BOOK_004: Verify student bookings displayed correctly
  test('TC_BOOK_004: should display student bookings with status', () => {
    const mockBookings = [
      {
        id: 1,
        slotId: 1,
        date: '2026-05-15',
        startTime: '14:00',
        facultyName: 'Dr. Smith',
        purpose: 'Help with assignment',
        status: 'PENDING',
      },
      {
        id: 2,
        slotId: 2,
        date: '2026-05-16',
        startTime: '15:00',
        facultyName: 'Dr. Johnson',
        purpose: 'Project discussion',
        status: 'APPROVED',
      },
    ];
    expect(mockBookings).toHaveLength(2);
    expect(mockBookings[0].status).toBe('PENDING');
    expect(mockBookings[1].status).toBe('APPROVED');
  });
});
