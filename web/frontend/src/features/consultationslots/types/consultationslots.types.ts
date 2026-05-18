export interface ConsultationSlot {
  id: number;
  date: string;
  startTime: string;
  duration: number;
  isBooked: boolean;
  facultyId: number;
  facultyName: string;
  bookingId?: number;
  consultationStatus: string;
}

export interface CreateConsultationSlotRequest {
  date: string;
  startTime: string;
  duration: number;
}
