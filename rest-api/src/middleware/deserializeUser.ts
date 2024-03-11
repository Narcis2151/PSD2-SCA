import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';

import { verifyJwt } from '../utils/jwt';
import { JwtPayload } from 'jsonwebtoken';

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );
  if (!accessToken) {
    return next();
  }
  console.log(accessToken);
  const {
    valid,
    expired,
    decoded,
  }: { valid: boolean; expired: boolean; decoded: string | JwtPayload | null } =
    verifyJwt(accessToken);

  if (decoded && typeof decoded !== 'string') {
    console.log(decoded);
    res.locals.user = decoded['userId'];
    res.locals.consentId = decoded['consentId'];

    return next();
  }

  return next();
};

export default deserializeUser;
