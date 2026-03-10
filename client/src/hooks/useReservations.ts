import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface Reservation {
  id: string;
  pet: { id: string; name: string; breed: string };
  groomer: { id: string; shopName: string; address: string };
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'done';
  serviceType: 'bath' | 'cut' | 'full';
  memo: string | null;
  createdAt: string;
}

interface CreateReservationDto {
  petId: string;
  groomerId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceType: 'bath' | 'cut' | 'full';
  memo?: string;
}

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