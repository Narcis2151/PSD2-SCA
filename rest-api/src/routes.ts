import { Router } from 'express';
import { loginSchema } from './schemas/auth.schema';
import loginHandler from './controllers/auth.controller';
import validate from './middleware/validateResource';

const router = Router();

router.post(':consentId/login', validate(loginSchema), loginHandler);

export default router;