import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { sendEmail } from '../utils/sendEmail';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { unreadOnly } = req.query;
    const where: any = { userId };
    if (unreadOnly === 'true') where.isRead = false;

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, isRead: false },
    });

    res.json({ notifications, unreadCount });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data: { isRead: true, readAt: new Date() },
    });
    res.json(notification);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    await prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
    res.json({ message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Send notification to a user (admin action)
// @route   POST /api/notifications/send
// @access  Private/Admin
export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { userId, type, channel, title, message, metadata } = req.body;

    // Create in-app notification
    const notification = await prisma.notification.create({
      data: {
        userId,
        type: type || 'info',
        channel: channel || 'in-app',
        title,
        message,
        metadata: metadata ? JSON.stringify(metadata) : '{}',
      },
    });

    // Send via email if requested
    if (channel === 'email' || channel === 'all') {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user?.email) {
        await sendEmail({
          to: user.email,
          subject: title,
          text: message,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
              <div style="background:#000;color:#fff;padding:20px;border-radius:12px 12px 0 0;">
                <h1 style="margin:0;font-size:20px;">Munna Tours & Travels</h1>
              </div>
              <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 12px 12px;">
                <h2 style="color:#111;margin-top:0;">${title}</h2>
                <p style="color:#555;line-height:1.6;">${message}</p>
                <hr style="border:none;border-top:1px solid #f3f4f6;margin:20px 0;" />
                <p style="color:#9ca3af;font-size:12px;">This is an automated notification from Munna Tours & Travels.</p>
              </div>
            </div>
          `,
        }).catch(err => console.error('Failed to send email notification:', err));
      }
    }

    res.status(201).json(notification);
  } catch (error: any) {
    res.status(500).json({ message: 'Error sending notification', error: error.message });
  }
};

// @desc    Broadcast notification to all users (admin action)
// @route   POST /api/notifications/broadcast
// @access  Private/Admin
export const broadcastNotification = async (req: Request, res: Response) => {
  try {
    const { type, title, message, targetRole } = req.body;

    const where: any = {};
    if (targetRole) where.role = targetRole;

    const users = await prisma.user.findMany({ where, select: { id: true } });

    const notifications = await prisma.notification.createMany({
      data: users.map(user => ({
        userId: user.id,
        type: type || 'promo',
        channel: 'in-app',
        title,
        message,
      })),
    });

    res.status(201).json({ message: `Notification sent to ${users.length} users`, count: notifications.count });
  } catch (error: any) {
    res.status(500).json({ message: 'Error broadcasting notification', error: error.message });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: 'Notification deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting notification', error: error.message });
  }
};
