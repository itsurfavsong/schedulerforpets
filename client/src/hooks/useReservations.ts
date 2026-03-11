import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { type Reservation, type CreateReservationDto } from '../types';

export const useMyReservations = () =>
  useQuery({
    queryKey: ['reservations', 'me'],
    queryFn: () =>
      axiosInstance.get<Reservation[]>('/reservations/me').then((r) => r.data),
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateReservationDto) =>
      axiosInstance.post<Reservation>('/reservations', dto).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.patch(`/reservations/${id}/cancel`).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
};