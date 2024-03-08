import { z } from 'zod';

const params = z.object({
  consentId: z.string({ required_error: 'consentId is required' }),
});

export const loginSchema = z.object({
  params,
  body: z.object({
    username: z.string({ required_error: 'username is required' }),
    password: z.string({ required_error: 'password is required' }),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
