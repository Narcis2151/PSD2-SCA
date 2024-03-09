import { z } from 'zod';

//2 Endpoints
//One for getting the cosnent details, the Request should only contain the consentId in the params
//One for submitting the consent, the Request should contain the consentId in the params
//As well as a body with the validTo date, as well as the full list of accounts for which the consent is given
//For every account, 2 flags should be send, one if the account is for balances and one if the account is for transactions
//Since the recurringIndicator is sent in the consent initiation, there is no need to send it again
//Just like the frequency per day

export const getConsentSchema = z.object({
  params: z.object({
    consentId: z.string(),
  }),
});

export const submitConsentSchema = z.object({
  params: z.object({
    consentId: z.string(),
  }),
  body: z.object({
    validTo: z.string().optional(),
    accounts: z.array(
      z.object({
        accountId: z.number({ required_error: 'accountId is required' }),
        isBalancesAccount: z.boolean({
          required_error: 'isBalancesAccount is required',
        }),
        isTransactionsAccount: z.boolean({
          required_error: 'isTransactionsAccount is required',
        }),
      })
    ),
  }),
});

export type GetConsentInput = z.infer<typeof getConsentSchema>;
export type SubmitConsentInput = z.infer<typeof submitConsentSchema>;
