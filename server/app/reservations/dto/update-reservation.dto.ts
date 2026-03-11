import { z } from 'zod';

export const UpdateReservationSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'done']),
});

export type UpdateReservationDto = z.infer<typeof UpdateReservationSchema>;
