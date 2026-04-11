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

const SLOT_BASE_PATHS = ['/consultation-slots', '/slots'];

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
    let lastError: unknown;

    for (const path of SLOT_BASE_PATHS) {
      try {
        const response = await api.get(path);
        if (!Array.isArray(response.data)) {
          return [];
        }

        return response.data
          .map(normalizeSlot)
          .filter((slot) => Number.isFinite(slot.id));
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  },

  async create(payload: CreateConsultationSlotRequest): Promise<ConsultationSlot> {
    let lastError: unknown;

    for (const path of SLOT_BASE_PATHS) {
      try {
        const response = await api.post(path, payload);
        return normalizeSlot(response.data);
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  },

  async remove(id: number): Promise<void> {
    let lastError: unknown;

    for (const path of SLOT_BASE_PATHS) {
      try {
        await api.delete(`${path}/${id}`);
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  },
};

export default consultationSlotService;
