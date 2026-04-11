import api from '../api/axios';

export interface Slot {
  id: number;
  status?: string;
  isBooked?: boolean;
  booked?: boolean;
}

export interface Booking {
  id: number;
  slotId: number;
  purpose: string;
  status: string;
  studentId?: number;
  facultyId?: number;
  student?: {
    id?: number;
    email?: string;
  };
  faculty?: {
    id?: number;
    email?: string;
  };
}

export interface CreateBookingRequest {
  slotId: number;
  purpose: string;
}

export interface UpdateBookingRequest {
  slotId?: number;
  purpose?: string;
  status?: string;
}

const SLOT_PATHS = ['/slots', '/consultation-slots', '/bookings/slots'];

const toSlotList = (data: unknown): Slot[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item: any) => ({
      id: Number(item?.id ?? item?.slotId),
      status: item?.status,
      isBooked: item?.isBooked,
      booked: item?.booked,
    }))
    .filter((slot) => Number.isFinite(slot.id));
};

export const bookingService = {
  async getSlots(): Promise<Slot[]> {
    let lastError: unknown;

    for (const path of SLOT_PATHS) {
      try {
        const response = await api.get(path);
        return toSlotList(response.data);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  },

  async getBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  async createBooking(payload: CreateBookingRequest): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', payload);
    return response.data;
  },

  async updateBooking(id: number, payload: UpdateBookingRequest): Promise<Booking> {
    const response = await api.put<Booking>(`/bookings/${id}`, payload);
    return response.data;
  },

  isSlotBooked(slot: Slot): boolean {
    const status = (slot.status || '').toUpperCase();
    return Boolean(slot.booked || slot.isBooked || status === 'BOOKED');
  },
};

export default bookingService;
