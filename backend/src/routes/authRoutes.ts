import express from 'express';
import { registerUser, loginUser, getMe, logoutUser, updateProfile } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../schemas/authSchema';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.get('/me', protect, getMe);
router.post('/logout', logoutUser);
router.put('/update-profile', protect, updateProfile);

export default router;
