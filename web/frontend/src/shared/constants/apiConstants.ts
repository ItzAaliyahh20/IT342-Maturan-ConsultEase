export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  CONSULTATION_SLOTS: {
    GET_ALL: '/consultation-slots',
    CREATE: '/consultation-slots',
    DELETE: (id: number) => `/consultation-slots/${id}`,
  },
  BOOKINGS: {
    GET_ALL: '/bookings',
    CREATE: '/bookings',
    UPDATE: (id: number) => `/bookings/${id}`,
  },
  ADMIN: {
    CREATE_FACULTY: '/admin/faculty',
  },
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_LOGIN: '/auth/admin/login',
  DASHBOARD: '/dashboard',
  FACULTY: '/faculty',
  ADMIN: '/admin',
  BOOK_CONSULTATION: '/dashboard/book',
  MY_BOOKINGS: '/dashboard/bookings',
  CONSULTATION_SLOTS: '/consultation-slots',
  CREATE_SLOT: '/faculty/consultation-slots/create',
  ADD_FACULTY: '/admin/faculty/add',
};

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  ADMIN: 'ADMIN',
} as const;
