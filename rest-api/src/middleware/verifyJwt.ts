import { Request, Response, NextFunction } from 'express';

const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  const userConsentId = res.locals.consentId;
  const urlConsentId = req.params.consentId;

  if (!user || userConsentId !== urlConsentId) {
    return res.status(403).send('Forbidden');
  }

  return next();
};

export default requireUser;
