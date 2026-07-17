import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from './authMiddleware';

export const auditLog = (actionName?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    // Only log POST, PUT, DELETE or explicit actions
    const method = req.method;
    if (['POST', 'PUT', 'DELETE'].includes(method) || actionName) {
      
      // We need to wait for the response to finish to capture status and final action
      res.on('finish', async () => {
        try {
          const userId = req.user?.id || null;
          
          // Basic entity extraction (e.g. /api/bookings -> Booking)
          const segments = req.originalUrl.split('?')[0].split('/');
          let entity = 'Unknown';
          let entityId = null;
          
          if (segments.length >= 3) {
            entity = segments[2].charAt(0).toUpperCase() + segments[2].slice(1);
          }
          if (segments.length >= 4 && segments[3].length > 10) {
            // Assume UUID or long ID
            entityId = segments[3];
          }

          const action = actionName || method;
          
          // Avoid logging passwords or sensitive info
          const bodyCopy = { ...req.body };
          if (bodyCopy.password) bodyCopy.password = '***';
          if (bodyCopy.token) bodyCopy.token = '***';

          await prisma.auditLog.create({
            data: {
              userId,
              action,
              entity,
              entityId,
              details: JSON.stringify({
                path: req.originalUrl,
                method: req.method,
                status: res.statusCode,
                body: ['POST', 'PUT'].includes(method) ? bodyCopy : undefined,
              }),
              ipAddress: req.ip || req.socket.remoteAddress || 'unknown'
            }
          });
        } catch (error) {
          console.error('Audit Log Error:', error);
        }
      });
    }
    
    next();
  };
};
