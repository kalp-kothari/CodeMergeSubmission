import { Router } from 'express';
import { login, logout, me } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();
router.post('/login', loginLimiter, login);
router.post('/logout', authMiddleware, logout);
router.get('/me', authMiddleware, me);
export default router;
