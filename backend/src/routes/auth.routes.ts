import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/google', authController.googleAuth.bind(authController));
router.get('/me', authenticate, authController.me.bind(authController));
router.post('/onboarding/complete', authenticate, authController.completeOnboarding.bind(authController));

export default router;
