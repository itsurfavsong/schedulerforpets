import { z } from 'zod';

export const CreatePetSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요.'),
  breed: z.string(),
  gender: z.enum(['male', 'female']),
  weight: z.number().positive(),
  age: z.number().int().positive(),
  notes: z.string().optional(),
});

export type CreatePetDto = z.infer<typeof CreatePetSchema>;