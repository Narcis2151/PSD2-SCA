import { Request, Response } from 'express';
import { LoginInput } from '../schemas/auth.schema';
import loginUser from '../services/auth.service';

export default async function loginHandler(
  req: Request<LoginInput['params'], {}, LoginInput['body']>,
  res: Response
) {
  try {
    const { consentId } = req.params;
    const { username, password } = req.body;
    const user = await loginUser(username, password);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
}
