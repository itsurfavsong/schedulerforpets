import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

interface Pet {
  id: string;
  name: string;
  breed: string;
  weight: number;
  age: number;
  notes: string | null;
}

interface CreatePetDto {
  name: string;
  breed: string;
  weight: number;
  age: number;
  notes?: string;
}

export const useMyPets = () =>
  useQuery({
    queryKey: ['pets', 'me'],
    queryFn: () => axiosInstance.get<Pet[]>('/pets').then((r) => r.data),
  });

export const useCreatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreatePetDto) =>
      axiosInstance.post<Pet>('/pets', dto).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

export const useUpdatePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...dto }: CreatePetDto & { id: string }) =>
      axiosInstance.put<Pet>(`/pets/${id}`, dto).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};

export const useDeletePet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/pets/${id}`).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
};