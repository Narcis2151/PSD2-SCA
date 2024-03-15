import { z } from 'zod';

const params = z.object({
  consentId: z.string({ required_error: 'consentId is required' }),
});

export const getPartiesSchema = z.object({
  params,
});

export const postPartySchema = z.object({
  params,
  body: z.object({
    id: z.string({ required_error: 'partyId is required' }),
  }),
});

export type GetPartiesInput = z.infer<typeof getPartiesSchema>;
export type PostPartyInput = z.infer<typeof postPartySchema>;
