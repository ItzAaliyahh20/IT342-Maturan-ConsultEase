export interface ApiErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  errors?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export type UserRole = 'STUDENT' | 'FACULTY' | 'ADMIN';

export interface CommonUser {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  provider: string;
  createdAt: string;
}
