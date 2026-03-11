import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  phone: z.string().min(10, { message: '올바른 전화번호를 입력해주세요.' }),
  email: z.email({ message: '올바른 이메일을 입력해주세요.' }).optional(),
  password: z.string().min(6, { message: '비밀번호는 6자 이상이어야 합니다.' }),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
