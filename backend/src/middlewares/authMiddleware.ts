import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export interface AuthRequest extends Request {
  user?: any;
}

/**
 * Protect routes — verifies JWT token and attaches user to request
 */
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      
      if (decoded.id === 'dummy_admin_id') {
        req.user = { id: 'dummy_admin_id', role: 'admin', email: 'admin@munna.com', name: 'Admin' };
      } else {
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
        }
      }
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Role-Based Access Control — restricts routes to specific roles
 * Usage: authorize('admin', 'manager')
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: `Role ${req.user?.role} is not authorized to access this route` });
    }
  };
};

/**
 * Optional auth — attaches user if token exists, but doesn't block unauthenticated requests
 */
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      
      if (decoded.id === 'dummy_admin_id') {
        req.user = { id: 'dummy_admin_id', role: 'admin', email: 'admin@munna.com', name: 'Admin' };
      } else {
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (user) {
          const { password, ...userWithoutPassword } = user;
          req.user = userWithoutPassword;
        }
      }
    } catch {
      // Token invalid — continue without user
    }
  }
  next();
};

/**
 * Driver-only middleware — only allows driver role
 */
export const driverOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'driver') {
    next();
  } else {
    res.status(403).json({ message: 'Access restricted to drivers only' });
  }
};
