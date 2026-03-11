import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';
import { type RegisterDto, type LoginDto, type AuthResponse } from '../types';

export const useRegister = () => {
  return useMutation({
    mutationFn: (dto: RegisterDto) =>
      axiosInstance.post<{ message: string }>('/auth/register', dto).then((r) => r.data),
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (dto: LoginDto) =>
      axiosInstance.post<AuthResponse>('/auth/login', dto).then((r) => r.data),
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
    },
  });
};