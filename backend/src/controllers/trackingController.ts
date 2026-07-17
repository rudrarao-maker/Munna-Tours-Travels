import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

// @desc    Update driver location (called from driver app)
// @route   POST /api/tracking/location
// @access  Private/Driver
export const updateDriverLocation = async (req: AuthRequest, res: Response) => {
  try {
    const { driverId, vehicleId, latitude, longitude, heading, speed, accuracy } = req.body;

    const location = await prisma.driverLocation.create({
      data: {
        driverId,
        vehicleId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        heading: parseFloat(heading) || 0,
        speed: parseFloat(speed) || 0,
        accuracy: parseFloat(accuracy) || 0,
      },
    });

    // Also update vehicle's current position
    if (vehicleId) {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: {
          currentLat: parseFloat(latitude),
          currentLng: parseFloat(longitude),
        },
      }).catch(() => {}); // Non-critical
    }

    res.json(location);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
};

// @desc    Get latest location for a driver
// @route   GET /api/tracking/driver/:driverId
// @access  Public
export const getDriverLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = await prisma.driverLocation.findFirst({
      where: { driverId: req.params.driverId },
      orderBy: { timestamp: 'desc' },
      include: {
        driver: { select: { name: true, phone: true, avatar: true } },
        vehicle: { select: { name: true, type: true, registration: true } },
      },
    });

    if (!location) {
      res.status(404).json({ message: 'No location data found for this driver' });
      return;
    }

    res.json(location);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching driver location', error: error.message });
  }
};

// @desc    Get all active vehicle locations (fleet tracking)
// @route   GET /api/tracking/fleet
// @access  Private/Admin
export const getFleetLocations = async (req: Request, res: Response) => {
  try {
    // Get latest location for each driver who is online
    const onlineDrivers = await prisma.driver.findMany({
      where: { isOnline: true },
      select: { id: true, name: true, phone: true, currentVehicleId: true },
    });

    const locations = await Promise.all(
      onlineDrivers.map(async driver => {
        const latestLocation = await prisma.driverLocation.findFirst({
          where: { driverId: driver.id },
          orderBy: { timestamp: 'desc' },
        });

        let vehicle = null;
        if (driver.currentVehicleId) {
          vehicle = await prisma.vehicle.findUnique({
            where: { id: driver.currentVehicleId },
            select: { name: true, type: true, registration: true, capacity: true },
          });
        }

        return {
          driver: { id: driver.id, name: driver.name, phone: driver.phone },
          vehicle,
          location: latestLocation ? {
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            heading: latestLocation.heading,
            speed: latestLocation.speed,
            timestamp: latestLocation.timestamp,
          } : null,
        };
      })
    );

    // Filter out drivers with no location data
    const activeLocations = locations.filter(l => l.location !== null);

    // If no real data, return demo positions
    if (activeLocations.length === 0) {
      return res.json(getDemoFleetLocations());
    }

    res.json(activeLocations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching fleet locations', error: error.message });
  }
};

// @desc    Get location history for a vehicle/driver
// @route   GET /api/tracking/history/:driverId
// @access  Private/Admin
export const getLocationHistory = async (req: Request, res: Response) => {
  try {
    const { driverId } = req.params;
    const { hours = '24' } = req.query;

    const since = new Date();
    since.setHours(since.getHours() - parseInt(String(hours)));

    const locations = await prisma.driverLocation.findMany({
      where: {
        driverId,
        timestamp: { gte: since },
      },
      orderBy: { timestamp: 'asc' },
    });

    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching location history', error: error.message });
  }
};

// @desc    Toggle driver online status
// @route   PUT /api/tracking/status
// @access  Private/Driver
export const toggleDriverStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { driverId, isOnline } = req.body;
    
    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: { isOnline },
    });

    res.json({ id: driver.id, name: driver.name, isOnline: driver.isOnline });
  } catch (error: any) {
    res.status(500).json({ message: 'Error toggling driver status', error: error.message });
  }
};

function getDemoFleetLocations() {
  return [
    {
      driver: { id: 'd1', name: 'Rajesh Kumar', phone: '+91 98765 43210' },
      vehicle: { name: 'Volvo B11R Sleeper', type: 'Volvo A/C Sleeper', registration: 'GJ-01-XX-1234', capacity: 40 },
      location: { latitude: 23.0225, longitude: 72.5714, heading: 45, speed: 65, timestamp: new Date() },
    },
    {
      driver: { id: 'd2', name: 'Suresh Patel', phone: '+91 98765 43211' },
      vehicle: { name: 'Scania Metrolink', type: 'Scania Multi-Axle', registration: 'GJ-01-XX-5678', capacity: 44 },
      location: { latitude: 22.3072, longitude: 73.1812, heading: 180, speed: 72, timestamp: new Date() },
    },
    {
      driver: { id: 'd3', name: 'Amit Shah', phone: '+91 98765 43212' },
      vehicle: { name: 'BharatBenz 1624', type: 'BharatBenz Premium', registration: 'GJ-05-XX-9012', capacity: 36 },
      location: { latitude: 21.1702, longitude: 72.8311, heading: 270, speed: 55, timestamp: new Date() },
    },
    {
      driver: { id: 'd4', name: 'Vikram Singh', phone: '+91 98765 43213' },
      vehicle: { name: 'Volvo 9600', type: 'Volvo A/C Semi-Sleeper', registration: 'MH-04-XX-3456', capacity: 48 },
      location: { latitude: 19.0760, longitude: 72.8777, heading: 90, speed: 45, timestamp: new Date() },
    },
    {
      driver: { id: 'd5', name: 'Pradeep Joshi', phone: '+91 98765 43214' },
      vehicle: { name: 'Ashok Leyland Viking', type: 'A/C Seater', registration: 'RJ-14-XX-7890', capacity: 52 },
      location: { latitude: 26.9124, longitude: 75.7873, heading: 315, speed: 60, timestamp: new Date() },
    },
  ];
}
