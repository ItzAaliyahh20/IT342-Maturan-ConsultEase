import '../../../shared/api/apiClient';

export interface ConsultationSlot {
  id: number;
  date: string;
  startTime: string;
  duration: number;
  isBooked: boolean;
  facultyId: number;
  facultyName: string;
  bookingId?: number;
  consultationStatus?: string;
}

export interface CreateConsultationSlotRequest {
  date: string;
  startTime: string;
  duration: number;
}

const SLOT_BASE_PATHS = ['/consultation-slots'];

const normalizeSlot = (item: any): ConsultationSlot => {
  return {
    id: Number(item?.id),
    date: item?.date || '',
    startTime: item?.startTime || item?.start_time || '',
    duration: Number(item?.duration || 0),
    isBooked: Boolean(item?.isBooked ?? item?.is_booked ?? false),
    facultyId: Number(item?.facultyId ?? item?.faculty_id ?? 0),
    facultyName: item?.facultyName || item?.faculty_name || `Faculty #${item?.facultyId ?? item?.faculty_id ?? 'N/A'}`,
    bookingId: item?.bookingId ?? item?.booking_id,
    consultationStatus: item?.consultationStatus || item?.consultation_status || 'PENDING',
  };
};

export const consultationSlotService = {
  async getAll(): Promise<ConsultationSlot[]> {
    const api = (await import('../../../shared/api/apiClient')).default;
    let lastError: unknown;

    console.log('getAll() called, trying paths:', SLOT_BASE_PATHS);

    for (const path of SLOT_BASE_PATHS) {
      try {
        console.log('Fetching from path:', path);
        const response = await api.get(path);
        console.log('Response from', path, ':', response);
        if (!Array.isArray(response.data)) {
          console.log('Response data is not an array, returning empty array');
          return [];
        }

        const normalized = response.data
          .map(normalizeSlot)
          .filter((slot) => Number.isFinite(slot.id));
        console.log('Normalized slots:', normalized);
        return normalized;
      } catch (error) {
        console.error('Error fetching from', path, ':', error);
        lastError = error;
      }
    }

    console.error('All paths failed, throwing lastError:', lastError);
    throw lastError;
  },

  async create(payload: CreateConsultationSlotRequest): Promise<ConsultationSlot> {
    const api = (await import('../../../shared/api/apiClient')).default;
    let lastError: unknown;

    for (const path of SLOT_BASE_PATHS) {
      try {
        console.log('Creating slot at path:', path, 'with payload:', payload);
        const response = await api.post(path, payload);
        console.log('Create response:', response.data);
        const normalized = normalizeSlot(response.data);
        console.log('Normalized slot:', normalized);
        return normalized;
      } catch (error) {
        console.error('Create error at path', path, ':', error);
        lastError = error;
      }
    }

    throw lastError;
  },

  async remove(id: number): Promise<void> {
    const api = (await import('../../../shared/api/apiClient')).default;
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
