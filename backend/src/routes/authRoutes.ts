import express from 'express';
import { registerUser, login, getMe, logoutUser, updateProfile, generate2FA, verify2FA } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.put('/update-profile', protect, updateProfile);
router.post('/2fa/generate', protect, generate2FA);
router.post('/2fa/verify', protect, verify2FA);

export default router;
