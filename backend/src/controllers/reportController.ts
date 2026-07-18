import { Request, Response } from 'express';
import prisma from '../config/prisma';

// @desc    Get comprehensive report
// @route   GET /api/reports/:type
// @access  Private/Admin
export const getReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params;
    const { from, to } = req.query;

    // Date range filter
    const dateFilter: any = {};
    if (from) dateFilter.gte = new Date(String(from));
    if (to) dateFilter.lte = new Date(String(to));
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    switch (type) {
      case 'revenue': {
        const bookings = await prisma.booking.findMany({
          where: hasDateFilter ? { createdAt: dateFilter } : {},
          include: { route: { select: { from: true, to: true, type: true } } },
          orderBy: { createdAt: 'desc' },
        });

        const totalRevenue = bookings.reduce((sum, b) => sum + (parseFloat(b.totalPrice as unknown as string) || 0), 0);
        const paidBookings = bookings.filter(b => b.paymentStatus === 'Paid');
        const pendingRevenue = bookings.filter(b => b.paymentStatus === 'Pending').reduce((sum, b) => sum + (parseFloat(b.totalPrice as unknown as string) || 0), 0);

        // Revenue by route
        const routeRevenue: Record<string, number> = {};
        bookings.forEach(b => {
          const routeKey = b.route ? `${b.route.from} → ${b.route.to}` : 'Unknown';
          routeRevenue[routeKey] = (routeRevenue[routeKey] || 0) + (parseFloat(b.totalPrice as unknown as string) || 0);
        });

        // Daily revenue for chart
        const dailyRevenue: Record<string, number> = {};
        bookings.forEach(b => {
          const day = new Date(b.createdAt).toISOString().split('T')[0];
          dailyRevenue[day] = (dailyRevenue[day] || 0) + (parseFloat(b.totalPrice as unknown as string) || 0);
        });

        res.json({
          type: 'revenue',
          totalRevenue,
          paidRevenue: paidBookings.reduce((sum, b) => sum + (parseFloat(b.totalPrice as unknown as string) || 0), 0),
          pendingRevenue,
          totalBookings: bookings.length,
          avgBookingValue: bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : 0,
          routeBreakdown: Object.entries(routeRevenue).map(([route, revenue]) => ({ route, revenue })).sort((a, b) => b.revenue - a.revenue),
          dailyTrend: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue })).sort((a, b) => a.date.localeCompare(b.date)),
        });
        break;
      }

      case 'bookings': {
        const bookings = await prisma.booking.findMany({
          where: hasDateFilter ? { createdAt: dateFilter } : {},
          include: {
            route: { select: { from: true, to: true } },
            user: { select: { email: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        });

        const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
        const cancelled = bookings.filter(b => b.status === 'Cancelled').length;
        const completed = bookings.filter(b => b.status === 'Completed').length;

        // Bookings per day
        const dailyBookings: Record<string, number> = {};
        bookings.forEach(b => {
          const day = new Date(b.createdAt).toISOString().split('T')[0];
          dailyBookings[day] = (dailyBookings[day] || 0) + 1;
        });

        res.json({
          type: 'bookings',
          total: bookings.length,
          confirmed,
          cancelled,
          completed,
          cancellationRate: bookings.length > 0 ? ((cancelled / bookings.length) * 100).toFixed(1) : 0,
          totalPassengers: bookings.reduce((sum, b) => sum + b.passengers, 0),
          dailyTrend: Object.entries(dailyBookings).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
          recentBookings: bookings.slice(0, 20),
        });
        break;
      }

      case 'fleet': {
        const vehicles = await prisma.vehicle.findMany();
        const fleetLogs = await prisma.fleetLog.findMany({
          where: hasDateFilter ? { createdAt: dateFilter } : {},
          include: { vehicle: { select: { name: true, registration: true } } },
          orderBy: { createdAt: 'desc' },
        });

        const totalCost = fleetLogs.reduce((sum, l) => sum + l.cost, 0);

        res.json({
          type: 'fleet',
          totalVehicles: vehicles.length,
          activeVehicles: vehicles.filter(v => v.status === 'active').length,
          maintenanceVehicles: vehicles.filter(v => v.status === 'maintenance').length,
          totalMaintenanceCost: totalCost,
          totalMileage: vehicles.reduce((sum, v) => sum + v.mileage, 0),
          costByType: {
            maintenance: fleetLogs.filter(l => l.type === 'maintenance').reduce((s, l) => s + l.cost, 0),
            fuel: fleetLogs.filter(l => l.type === 'fuel').reduce((s, l) => s + l.cost, 0),
            repair: fleetLogs.filter(l => l.type === 'repair').reduce((s, l) => s + l.cost, 0),
          },
          vehicleUtilization: vehicles.map(v => ({
            name: v.name,
            registration: v.registration,
            status: v.status,
            mileage: v.mileage,
            fuelLevel: v.fuelLevel,
          })),
          recentLogs: fleetLogs.slice(0, 20),
        });
        break;
      }

      case 'drivers': {
        const drivers = await prisma.driver.findMany();

        res.json({
          type: 'drivers',
          totalDrivers: drivers.length,
          activeDrivers: drivers.filter(d => d.status === 'active').length,
          onlineDrivers: drivers.filter(d => d.isOnline).length,
          avgRating: drivers.length > 0 ? (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1) : 0,
          totalTrips: drivers.reduce((sum, d) => sum + d.totalTrips, 0),
          driverPerformance: drivers.map(d => ({
            id: d.id,
            name: d.name,
            rating: d.rating,
            totalTrips: d.totalTrips,
            status: d.status,
            isOnline: d.isOnline,
          })).sort((a, b) => b.rating - a.rating),
        });
        break;
      }

      default:
        res.status(400).json({ message: `Unknown report type: ${type}. Available: revenue, bookings, fleet, drivers` });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

// @desc    Get summary stats for dashboard
// @route   GET /api/reports/summary
// @access  Private/Admin
export const getSummary = async (req: Request, res: Response) => {
  try {
    const [totalBookings, totalUsers, totalVehicles, totalDrivers] = await Promise.all([
      prisma.booking.count(),
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.driver.count(),
    ]);

    const allBookings = await prisma.booking.findMany({ select: { totalPrice: true, status: true, paymentStatus: true } });
    const totalRevenue = allBookings.reduce((sum, b) => sum + (parseFloat(b.totalPrice as unknown as string) || 0), 0);
    const paidRevenue = allBookings.filter(b => b.paymentStatus === 'Paid').reduce((sum, b) => sum + (parseFloat(b.totalPrice as unknown as string) || 0), 0);

    const totalPackages = await prisma.tourPackage.count();
    const totalHotels = await prisma.hotel.count();
    const totalFeedback = await prisma.feedback.count();
    const avgFeedbackRating = await prisma.feedback.aggregate({ _avg: { rating: true } });

    res.json({
      totalBookings,
      totalRevenue,
      paidRevenue,
      totalUsers,
      totalVehicles,
      totalDrivers,
      totalPackages,
      totalHotels,
      totalFeedback,
      avgFeedbackRating: avgFeedbackRating._avg.rating || 0,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching summary', error: error.message });
  }
};
