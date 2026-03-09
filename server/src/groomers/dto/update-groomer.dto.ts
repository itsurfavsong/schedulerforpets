import { z } from 'zod';

export const UpdateGroomerSchema = z.object({
  shopName: z.string().min(1, '매장명을 입력해주세요.'),
  address: z.string().min(1, '주소를 입력해주세요.'),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type UpdateGroomerDto = z.infer<typeof UpdateGroomerSchema>;