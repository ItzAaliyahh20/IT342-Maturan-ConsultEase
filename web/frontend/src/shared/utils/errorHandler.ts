import { AxiosError } from 'axios';
import { ApiErrorResponse } from '../types/common.types';

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse;
    return data?.message || error.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const isApiError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return error instanceof AxiosError;
};
