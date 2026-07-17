import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCache, setCache } from '../config/redis';

const prisma = new PrismaClient();

const ANALYTICS_CACHE_KEY = 'cache:analytics';
const ANALYTICS_CACHE_TTL = 120; // 2 minutes

// @desc    Get dashboard analytics
// @route   GET /api/analytics
// @access  Private/Admin
export const getAnalytics = async (req: Request, res: Response) => {
  try {
    // Try cache first
    const cached = await getCache(ANALYTICS_CACHE_KEY);
    if (cached) {
      res.json(cached);
      return;
    }

    const totalBookings = await prisma.booking.count();
    // Calculate revenue since it's a string in DB
    
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

    const analyticsData = {
      totalBookings,
      totalRevenue,
      activeVehicles,
      activeDrivers,
      totalUsers,
      chartData
    };

    // Cache the result
    await setCache(ANALYTICS_CACHE_KEY, analyticsData, ANALYTICS_CACHE_TTL);

    res.json(analyticsData);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
