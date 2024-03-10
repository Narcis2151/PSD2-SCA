import { Request, Response, NextFunction } from 'express';

const requireUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(403).send('Forbidden');
  }

  return next();
};

export default requireUser;
