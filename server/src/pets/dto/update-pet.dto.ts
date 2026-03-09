import { z } from 'zod';

export const UpdatePetSchema = z.object({
  name: z.string().min(1),
  breed: z.string(),
  weight: z.number().positive(),
  age: z.number().int().positive(),
  notes: z.string().optional(),
});

export type UpdatePetDto = z.infer<typeof UpdatePetSchema>;