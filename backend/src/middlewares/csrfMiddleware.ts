import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Basic Double Submit Cookie pattern for CSRF protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Methods that don't change state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    // Generate new token if not present
    if (!req.cookies['XSRF-TOKEN']) {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie('XSRF-TOKEN', token, {
        httpOnly: false, // Frontend needs to read this to send it back in headers
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
    return next();
  }

  // State-changing methods
  const cookieToken = req.cookies['XSRF-TOKEN'];
  const headerToken = req.headers['x-xsrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: 'CSRF token validation failed' });
  }

  next();
};
