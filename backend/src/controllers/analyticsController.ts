import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalRevenueResult = await prisma.booking.aggregate({
      _sum: {
        totalPrice: true // Wait, totalPrice is String in schema. We need to parse it in JS.
      }
    });
    
    // Calculate revenue since it's a string in DB
    const allBookings = await prisma.booking.findMany({ select: { totalPrice: true }});
    const totalRevenue = allBookings.reduce((sum, booking) => sum + parseFloat(booking.totalPrice || '0'), 0);
    
    const activeVehicles = await prisma.vehicle.count({ where: { status: 'active' }});
    const activeDrivers = await prisma.driver.count({ where: { status: 'active' }});
    const totalUsers = await prisma.user.count();
    
    // Revenue over time (Mocking for now, or just send raw bookings to frontend to chart)
    const recentBookings = await prisma.booking.findMany({
      take: 30,
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, totalPrice: true }
    });
    
    const chartData = recentBookings.map(b => ({
      date: b.createdAt.toISOString().split('T')[0],
      revenue: parseFloat(b.totalPrice)
    })).reverse();

    res.json({
      totalBookings,
      totalRevenue,
      activeVehicles,
      activeDrivers,
      totalUsers,
      chartData
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
