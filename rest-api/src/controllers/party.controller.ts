import { Request, Response } from 'express';
import { GetPartiesInput, PostPartyInput } from '../schemas/party.schema';
import { validateConsent, postParty } from '../services/consent.service';
import getParties from '../services/party.service';

export async function getPartiesHandler(
  req: Request<GetPartiesInput['params'], {}, PostPartyInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const consent = await validateConsent(+consentId);
    if (!consent || consent.userId === null) {
      return res.status(404).send('Consent not found');
    }

    const parties = await getParties(consent.userId);
    return res.status(200).send(parties);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}

export async function postPartyHandler(
  req: Request<PostPartyInput['params'], {}, PostPartyInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const consent = await validateConsent(+consentId);
    if (!consent) {
      return res.status(404).send('Consent not found');
    }

    const { id } = req.body;
    await postParty(+consentId, +id);
    return res.status(200).send({ id });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
