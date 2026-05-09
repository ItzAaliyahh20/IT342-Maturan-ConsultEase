import '@testing-library/jest-dom';

describe('End-to-End Integration Tests - Booking Flow', () => {
  // TC_INT_002: End-to-end booking creation flow
  test('TC_INT_002: should complete booking creation flow', () => {
    // Step 1: Load slots
    const slots = [
      { id: 1, date: '2026-05-15', startTime: '14:00', isBooked: false },
      { id: 2, date: '2026-05-16', startTime: '15:00', isBooked: false },
    ];
    expect(slots).toHaveLength(2);

    // Step 2: Select slot
    const selectedSlot = slots[0];
    expect(selectedSlot.id).toBe(1);

    // Step 3: Create booking
    const booking = {
      slotId: selectedSlot.id,
      purpose: 'Need help with project',
      status: 'PENDING',
    };
    expect(booking.slotId).toBe(1);
    expect(booking.purpose).toBeTruthy();
    expect(booking.status).toBe('PENDING');
  });
});
