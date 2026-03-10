import { z } from 'zod';

export const CreateReviewSchema = z.object({
  groomerId: z.uuid(),
  reservationId: z.uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>;