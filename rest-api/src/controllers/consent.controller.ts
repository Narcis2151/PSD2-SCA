import { Request, Response } from 'express';
import { GetConsentInput, SubmitConsentInput } from '../schemas/consent.schema';
import { getConsent, submitConsent } from '../services/consent.service';

export async function getConsentHandler(
  req: Request<GetConsentInput['params']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const { accounts, validTo, isRecurrent } = await getConsent(+consentId);

    return res.status(200).send({ accounts, validTo, isRecurrent });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}

export async function submitConsentHandler(
  req: Request<SubmitConsentInput['params'], {}, SubmitConsentInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;

    const tppRedirectUrl = await submitConsent(+consentId, req.body);
    if (!tppRedirectUrl) {
      return res.status(404).send('Consent not found');
    }

    return res.status(200).send({ tppRedirectUrl });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
