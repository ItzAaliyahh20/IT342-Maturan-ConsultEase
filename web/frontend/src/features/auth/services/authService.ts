import axios, { AxiosInstance } from 'axios';
import { AuthResponse, User } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface CreateFacultyPayload {
  fullName: string;
  email: string;
  temporaryPassword: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class AuthService {
  private apiClient: AxiosInstance;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.apiClient.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle responses
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  }

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await this.apiClient.post<AuthResponse>('/auth/register', payload);
    return response.data;
  }

  async createFaculty(payload: CreateFacultyPayload): Promise<User> {
    const response = await this.apiClient.post<User>('/admin/faculty', payload);
    return response.data;
  }

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await this.apiClient.put('/auth/change-password', payload);
  }

  async logout(): Promise<void> {
    try {
      await this.apiClient.post('/auth/logout');
    } finally {
      this.clearAuth();
    }
  }

  setAuth(authResponse: AuthResponse): void {
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('tokenType', authResponse.tokenType);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();
