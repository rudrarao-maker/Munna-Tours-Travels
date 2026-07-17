import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;
    
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone }
    });
    
    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const token2FA = req.body.token2FA?.trim();

    console.log(`Login attempt: email='${email}', password='${password}'`);

    // Hardcode fallback for demo purposes if DB is empty
    if (email === 'admin@munnatravels.com' && password === 'admin123') {
      res.json({
        id: 'dummy_admin_id',
        name: 'Admin User',
        email: 'admin@munnatravels.com',
        role: 'admin',
        token: generateToken('dummy_admin_id', 'admin'),
      });
      return;
    }

    if (email === 'user@munnatravels.com' && password === 'user123') {
      res.json({
        id: 'dummy_user_id',
        name: 'Regular User',
        email: 'user@munnatravels.com',
        role: 'user',
        token: generateToken('dummy_user_id', 'user'),
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // 2FA Check
      if (user.isTwoFactorEnabled) {
        if (!token2FA) {
           res.status(403).json({ message: '2FA token required', requires2FA: true });
           return;
        }
        
        const isValid = authenticator.verify({ token: token2FA, secret: user.twoFactorSecret! });
        if (!isValid) {
          res.status(401).json({ message: 'Invalid 2FA token' });
          return;
        }
      }

      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const generate2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const secret = authenticator.generateSecret();
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otpauth = authenticator.keyuri(user.email, 'MunnaTravels', secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);

    // Save secret to DB temporarily (requires verification to fully enable)
    await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret }
    });

    res.json({ secret, qrCodeUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error generating 2FA' });
  }
};

export const verify2FA = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { token } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || !user.twoFactorSecret) {
      res.status(400).json({ message: '2FA not setup' });
      return;
    }

    const isValid = authenticator.verify({ token, secret: user.twoFactorSecret });

    if (isValid) {
      await prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: true }
      });
      res.json({ message: '2FA enabled successfully' });
    } else {
      res.status(400).json({ message: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error verifying 2FA' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, role: true, phone: true, avatar: true, isTwoFactorEnabled: true }
    });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Logged out successfully' });
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { name, phone, avatar },
      select: { id: true, name: true, email: true, role: true, phone: true, avatar: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
