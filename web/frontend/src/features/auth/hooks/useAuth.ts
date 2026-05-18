import { useCallback } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      authService.clearAuth();
      window.location.href = '/login';
    }
  }, []);

  return {
    user,
    isAuthenticated,
    logout,
  };
};
