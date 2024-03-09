import { Request, Response } from 'express';
import { GetPartiesInput, PostPartyInput } from '../schemas/party.schema';
import { getConsent, postParty } from '../services/consent.service';
import getParties from '../services/party.service';

export async function getPartiesHandler(
  req: Request<GetPartiesInput['params'], {}, PostPartyInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const consent = await getConsent(+consentId);
    if (!consent) {
      return res.status(404).send('Consent not found');
    }

    const parties = await getParties(+consentId);
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
    const consent = await getConsent(+consentId);
    if (!consent) {
      return res.status(404).send('Consent not found');
    }

    const { partyId } = req.body;
    await postParty(+consentId, partyId);
    return res.status(200).send('Party added');
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
