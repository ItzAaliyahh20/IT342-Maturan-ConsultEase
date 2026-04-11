import api from '../api/axios';

export interface ConsultationSlot {
  id: number;
  date: string;
  startTime: string;
  duration: number;
  isBooked: boolean;
}

export interface CreateConsultationSlotRequest {
  date: string;
  startTime: string;
  duration: number;
}

const normalizeSlot = (item: any): ConsultationSlot => {
  return {
    id: Number(item?.id),
    date: item?.date || '',
    startTime: item?.startTime || item?.start_time || '',
    duration: Number(item?.duration || 0),
    isBooked: Boolean(item?.isBooked ?? item?.is_booked ?? false),
  };
};

export const consultationSlotService = {
  async getAll(): Promise<ConsultationSlot[]> {
    const response = await api.get('/consultation-slots');
    if (!Array.isArray(response.data)) {
      return [];
    }

    return response.data
      .map(normalizeSlot)
      .filter((slot) => Number.isFinite(slot.id));
  },

  async create(payload: CreateConsultationSlotRequest): Promise<ConsultationSlot> {
    const response = await api.post('/consultation-slots', payload);
    return normalizeSlot(response.data);
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/consultation-slots/${id}`);
  },
};

export default consultationSlotService;
