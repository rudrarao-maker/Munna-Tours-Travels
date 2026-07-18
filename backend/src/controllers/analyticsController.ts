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

    // ─── Core Counts ─────────────────────────────────────────────
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      refundedBookings,
      totalUsers,
      activeVehicles,
      activeDrivers,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'Pending' } }),
      prisma.booking.count({ where: { status: 'Confirmed' } }),
      prisma.booking.count({ where: { status: 'Completed' } }),
      prisma.booking.count({ where: { status: 'Cancelled' } }),
      prisma.booking.count({ where: { status: 'Refunded' } }),
      prisma.user.count(),
      prisma.vehicle.count({ where: { status: 'active' } }),
      prisma.driver.count({ where: { status: 'active' } }),
    ]);

    // ─── Revenue ─────────────────────────────────────────────────
    const allBookings = await prisma.booking.findMany({
      select: { totalPrice: true, createdAt: true, status: true, date: true },
    });
    const totalRevenue = allBookings
      .filter(b => b.status !== 'Cancelled' && b.status !== 'Refunded')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // ─── Revenue Chart (last 30 days, daily) ─────────────────────
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBookings = await prisma.booking.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, totalPrice: true, status: true },
      orderBy: { createdAt: 'asc' },
    });

    // Group by day
    const dailyMap: Record<string, { revenue: number; bookings: number }> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - 29 + i);
      const key = d.toISOString().split('T')[0];
      dailyMap[key] = { revenue: 0, bookings: 0 };
    }
    recentBookings.forEach(b => {
      const key = b.createdAt.toISOString().split('T')[0];
      if (dailyMap[key]) {
        dailyMap[key].revenue += b.totalPrice || 0;
        dailyMap[key].bookings += 1;
      }
    });

    const dailyChartData = Object.entries(dailyMap).map(([date, data]) => ({
      date,
      label: new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      revenue: Math.round(data.revenue),
      bookings: data.bookings,
    }));

    // ─── Monthly Bookings (last 12 months) ───────────────────────
    const monthlyMap: Record<string, { bookings: number; revenue: number; cancellations: number }> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap[key] = { bookings: 0, revenue: 0, cancellations: 0 };
    }

    allBookings.forEach(b => {
      const key = `${b.createdAt.getFullYear()}-${String(b.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key]) {
        monthlyMap[key].bookings += 1;
        monthlyMap[key].revenue += b.totalPrice || 0;
        if (b.status === 'Cancelled' || b.status === 'Refunded') {
          monthlyMap[key].cancellations += 1;
        }
      }
    });

    const monthlyChartData = Object.entries(monthlyMap).map(([key, data]) => {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', { month: 'short' });
      return { month: monthName, ...data };
    });

    // ─── Top Destinations ────────────────────────────────────────
    const routeBookings = await prisma.booking.findMany({
      include: { route: { select: { to: true, from: true } } },
    });

    const destMap: Record<string, number> = {};
    routeBookings.forEach(b => {
      if (b.route?.to) {
        destMap[b.route.to] = (destMap[b.route.to] || 0) + 1;
      }
    });
    const topDestinations = Object.entries(destMap)
      .map(([name, bookings]) => ({ name, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 8);

    // ─── Peak Booking Hours ──────────────────────────────────────
    const hourMap: Record<number, number> = {};
    for (let h = 0; h < 24; h++) hourMap[h] = 0;
    allBookings.forEach(b => {
      const hour = b.createdAt.getHours();
      hourMap[hour] = (hourMap[hour] || 0) + 1;
    });
    const peakHoursData = Object.entries(hourMap).map(([hour, count]) => ({
      hour: `${String(hour).padStart(2, '0')}:00`,
      bookings: count,
    }));

    // ─── User Growth (last 12 months) ────────────────────────────
    const allUsers = await prisma.user.findMany({
      select: { createdAt: true },
    });

    const userGrowthMap: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      userGrowthMap[key] = 0;
    }
    allUsers.forEach(u => {
      const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, '0')}`;
      if (userGrowthMap[key] !== undefined) {
        userGrowthMap[key] += 1;
      }
    });
    const userGrowthData = Object.entries(userGrowthMap).map(([key, count]) => {
      const [year, month] = key.split('-');
      const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', { month: 'short' });
      return { month: monthName, newUsers: count };
    });

    // ─── Customer Segmentation ───────────────────────────────────
    const userBookingGroups = await prisma.booking.groupBy({
      by: ['userId'],
      _sum: { totalPrice: true },
    });
    const highValueThreshold = 50000;
    let highValueCount = 0;
    let standardCount = 0;
    userBookingGroups.forEach(u => {
      if ((u._sum.totalPrice || 0) >= highValueThreshold) {
        highValueCount++;
      } else {
        standardCount++;
      }
    });

    // ─── Demand Forecasting ──────────────────────────────────────
    const currentMonthRevenue = recentBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const forecastedRevenue = currentMonthRevenue * 1.15;

    // ─── Popular Routes (from → to with counts) ─────────────────
    const routeCountMap: Record<string, number> = {};
    routeBookings.forEach(b => {
      if (b.route) {
        const key = `${b.route.from} → ${b.route.to}`;
        routeCountMap[key] = (routeCountMap[key] || 0) + 1;
      }
    });
    const popularRoutes = Object.entries(routeCountMap)
      .map(([route, bookings]) => ({ route, bookings }))
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 6);

    // ─── Recent Bookings Table ───────────────────────────────────
    const latestBookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        route: { select: { from: true, to: true } },
        user: { select: { name: true, email: true } },
      },
    });
    const recentBookingsTable = latestBookings.map(b => ({
      id: b.id,
      user: b.user?.name || b.user?.email || 'Guest',
      route: b.route ? `${b.route.from} to ${b.route.to}` : 'N/A',
      amount: `₹${(b.totalPrice || 0).toLocaleString()}`,
      status: b.status,
      date: b.createdAt.toISOString().split('T')[0],
    }));

    // ─── Destination Heatmap ─────────────────────────────────────
    const destinationHeatmap = Object.entries(destMap).map(k => ({
      location: k[0],
      intensity: k[1],
    }));

    // ─── Assemble Response ───────────────────────────────────────
    const analyticsData = {
      // KPI Cards
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      refundedBookings,
      totalRevenue: Math.round(totalRevenue),
      totalUsers,
      activeVehicles,
      activeDrivers,

      // Charts
      dailyChartData,
      monthlyChartData,
      topDestinations,
      peakHoursData,
      userGrowthData,
      popularRoutes,
      recentBookingsTable,

      // Advanced
      segmentation: { highValueCount, standardCount },
      demandForecasting: { nextMonthEstimate: Math.round(forecastedRevenue) },
      destinationHeatmap,
    };

    // Cache the result
    await setCache(ANALYTICS_CACHE_KEY, analyticsData, ANALYTICS_CACHE_TTL);

    res.json(analyticsData);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};
