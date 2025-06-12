import { Router } from 'express';
import authRouter from './auth';
import mfaRouter from './mfa';
import passwordResetRouter from './passwordReset';
import emailVerificationRouter from './emailVerification';

const router = Router();

// Auth routes
router.use('/', authRouter);

// MFA routes
router.use('/mfa', mfaRouter);

// Password reset routes
router.use('/password-reset', passwordResetRouter);

// Email verification routes
router.use('/email-verification', emailVerificationRouter);

export default router; 