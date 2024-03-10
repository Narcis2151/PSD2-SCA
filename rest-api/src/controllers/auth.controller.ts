import { Request, Response } from 'express';
import { validateConsent, addConsentUser } from '../services/consent.service';
import { LoginInput } from '../schemas/auth.schema';
import { signJwt } from '../utils/jwt';
import config from 'config';
import loginUser from '../services/auth.service';

export default async function loginHandler(
  req: Request<LoginInput['params'], {}, LoginInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const consent = await validateConsent(+consentId);
    if (!consent) {
      return res.status(404).send('Consent not found');
    }

    const { username, password } = req.body;
    const user = await loginUser(username, password);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }
    const expiresIn = config.get<string>('accessTokenTtl');
    const accessToken = signJwt(
      { userId: user.id, consentId: consentId },
      { expiresIn: expiresIn } // 15m
    );

    await addConsentUser(+consentId, user.id);
    return res.status(200).send({
      accessToken: accessToken,
      expiresIn: expiresIn,
    });
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
