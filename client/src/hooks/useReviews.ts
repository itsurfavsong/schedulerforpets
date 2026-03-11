import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { type Review, type RatingInfo } from '../types';

export const useGroomerReviews = (groomerId: string) =>
  useQuery({
    queryKey: ['reviews', groomerId],
    queryFn: () =>
      axiosInstance.get<Review[]>(`/reviews/groomer/${groomerId}`).then((r) => r.data),
  });

export const useGroomerRating = (groomerId: string) =>
  useQuery({
    queryKey: ['rating', groomerId],
    queryFn: () =>
      axiosInstance.get<RatingInfo>(`/reviews/groomer/${groomerId}/rating`).then((r) => r.data),
  });

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axiosInstance.delete(`/reviews/${id}`).then((r) => r.data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['reviews'] });
      void queryClient.invalidateQueries({ queryKey: ['rating'] });
    },
  });
};