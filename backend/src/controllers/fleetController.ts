import { Request, Response } from 'express';
import prisma from '../config/prisma';

// @desc    Get fleet overview (all vehicles with status)
// @route   GET /api/fleet
// @access  Private/Admin
export const getFleetOverview = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const totalVehicles = vehicles.length;
    const activeCount = vehicles.filter(v => v.status === 'active').length;
    const maintenanceCount = vehicles.filter(v => v.status === 'maintenance').length;
    const retiredCount = vehicles.filter(v => v.status === 'retired').length;

    res.json({
      vehicles,
      stats: {
        total: totalVehicles,
        active: activeCount,
        maintenance: maintenanceCount,
        retired: retiredCount,
        utilization: totalVehicles > 0 ? ((activeCount / totalVehicles) * 100).toFixed(1) : 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching fleet', error: error.message });
  }
};

// @desc    Get maintenance logs for a vehicle
// @route   GET /api/fleet/:vehicleId/logs
// @access  Private/Admin
export const getFleetLogs = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    const type = req.query.type as string;

    const where: any = { vehicleId };
    if (type) where.type = String(type);

    const logs = await prisma.fleetLog.findMany({
      where,
      include: { vehicle: { select: { name: true, registration: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching fleet logs', error: error.message });
  }
};

// @desc    Add a fleet log entry
// @route   POST /api/fleet/logs
// @access  Private/Admin
export const addFleetLog = async (req: Request, res: Response) => {
  try {
    const { vehicleId, type, description, cost, odometerKm, performedBy, date, nextDueDate } = req.body;

    const log = await prisma.fleetLog.create({
      data: {
        vehicleId,
        type,
        description: description || '',
        cost: parseFloat(cost) || 0,
        odometerKm: parseFloat(odometerKm) || 0,
        performedBy: performedBy || '',
        date,
        nextDueDate,
      },
    });

    // Update vehicle mileage if odometer provided
    if (odometerKm) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { mileage: parseFloat(odometerKm) },
      });
    }

    // If maintenance log, optionally update vehicle status
    if (type === 'maintenance') {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'maintenance', lastServiceDate: date },
      });
    }

    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding fleet log', error: error.message });
  }
};

// @desc    Get fleet analytics
// @route   GET /api/fleet/analytics
// @access  Private/Admin
export const getFleetAnalytics = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany();
    const allLogs = await prisma.fleetLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Cost breakdown by type
    const maintenanceCost = allLogs.filter(l => l.type === 'maintenance').reduce((sum, l) => sum + l.cost, 0);
    const fuelCost = allLogs.filter(l => l.type === 'fuel').reduce((sum, l) => sum + l.cost, 0);
    const repairCost = allLogs.filter(l => l.type === 'repair').reduce((sum, l) => sum + l.cost, 0);
    const totalCost = allLogs.reduce((sum, l) => sum + l.cost, 0);

    // Vehicles needing service (mock logic — last service > 30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const upcomingMaintenance = vehicles.filter(v => {
      if (!v.lastServiceDate) return true;
      return new Date(v.lastServiceDate) < thirtyDaysAgo;
    });

    // Fuel efficiency (total fuel cost / total mileage)
    const totalMileage = vehicles.reduce((sum, v) => sum + v.mileage, 0);

    res.json({
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'active').length,
      totalCost,
      costBreakdown: {
        maintenance: maintenanceCost,
        fuel: fuelCost,
        repair: repairCost,
      },
      totalMileage,
      avgFuelCostPerKm: totalMileage > 0 ? (fuelCost / totalMileage).toFixed(2) : 0,
      upcomingMaintenanceCount: upcomingMaintenance.length,
      upcomingMaintenance: upcomingMaintenance.map(v => ({
        id: v.id,
        name: v.name,
        registration: v.registration,
        lastService: v.lastServiceDate,
      })),
      recentLogs: allLogs.slice(0, 10),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching fleet analytics', error: error.message });
  }
};

// @desc    Assign driver to vehicle
// @route   PUT /api/fleet/:vehicleId/assign
// @access  Private/Admin
export const assignDriver = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    const { driverId } = req.body;

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { assignedDriverId: driverId },
    });

    if (driverId) {
      await prisma.driver.update({
        where: { id: driverId },
        data: { currentVehicleId: vehicleId },
      });
    }

    res.json({ message: 'Driver assigned to vehicle successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error assigning driver', error: error.message });
  }
};

// @desc    Update vehicle status
// @route   PUT /api/fleet/:vehicleId/status
// @access  Private/Admin
export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const vehicleId = req.params.vehicleId as string;
    const { status } = req.body;

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status },
    });

    res.json(vehicle);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating vehicle status', error: error.message });
  }
};
