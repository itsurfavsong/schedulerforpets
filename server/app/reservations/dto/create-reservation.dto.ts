import { z } from 'zod';

export const CreateReservationSchema = z.object({
  groomerId: z.uuid('올바른 미용사 ID를 입력해주세요.'),
  petId: z.uuid('올바른 반려견 ID를 입력해주세요.'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD 이어야 합니다.'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, '시간 형식은 HH:MM 이어야 합니다.'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, '시간 형식은 HH:MM 이어야 합니다.'),
  serviceType: z.enum(['bath', 'cut', 'full']),
  memo: z.string().optional(),
});

export type CreateReservationDto = z.infer<typeof CreateReservationSchema>;
