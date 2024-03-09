import { Request, Response } from 'express';
import { LoginInput } from '../schemas/auth.schema';
import { signJwt } from '../utils/jwt';
import config from 'config';
import loginUser from '../services/auth.service';
import { getConsent, addConsentUser } from '../services/consent.service';

export default async function loginHandler(
  req: Request<LoginInput['params'], {}, LoginInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const consent = await getConsent(+consentId);
    if (!consent) {
      return res.status(404).send('Consent not found');
    }
    
    const { username, password } = req.body;
    const user = await loginUser(username, password);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    const accessToken = signJwt(
      { userId: user.id },
      { expiresIn: config.get<string>('accessTokenTtl') } // 15m
    );

    await addConsentUser(+consentId, user.id);
    return res.status(200).send({ accessToken });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
