export interface Booking {
  id: number;
  slotId: number;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  studentId: number;
  facultyId: number;
  student?: {
    id: number;
    email: string;
  };
  faculty?: {
    id: number;
    email: string;
  };
}

export interface CreateBookingRequest {
  slotId: number;
  purpose: string;
}

export interface UpdateBookingRequest {
  purpose?: string;
  status?: string;
}
