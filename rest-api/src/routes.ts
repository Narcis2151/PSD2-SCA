import { Router } from 'express';
import { loginSchema } from './schemas/auth.schema';
import { getPartiesSchema, postPartySchema } from './schemas/party.schema';
import loginHandler from './controllers/auth.controller';
import {
  getPartiesHandler,
  postPartyHandler,
} from './controllers/party.controller';
import validate from './middleware/validateResource';

const router = Router();

router.post(':consentId/login', validate(loginSchema), loginHandler);
router.get(':consentId/party', validate(getPartiesSchema), getPartiesHandler);
router.post(':consentId/party', validate(postPartySchema), postPartyHandler);

export default router;
