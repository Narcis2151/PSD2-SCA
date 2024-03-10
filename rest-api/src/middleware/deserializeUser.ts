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
  const {
    valid,
    expired,
    decoded,
  }: { valid: boolean; expired: boolean; decoded: string | JwtPayload | null } =
    verifyJwt(accessToken);

  if (decoded && typeof decoded !== 'string') {
    res.locals.user = decoded.payload['userId'];
    res.locals.consentId = decoded.payload['consentId'];

    return next();
  }

  return next();
};

export default deserializeUser;
