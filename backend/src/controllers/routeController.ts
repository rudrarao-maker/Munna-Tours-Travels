import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { getCache, setCache, invalidateCache } from '../config/redis';

const ROUTES_CACHE_KEY = 'cache:routes:all';
const ROUTES_CACHE_TTL = 300; // 5 minutes

export const getRoutes = async (req: Request, res: Response) => {
  try {
    // Try cache first
    const cached = await getCache(ROUTES_CACHE_KEY);
    if (cached) {
      res.json(cached);
      return;
    }

    const routes = await prisma.route.findMany();
    // Fallback if DB is empty
    if (routes.length === 0) {
      // Return hardcoded routes to prevent breaking the UI if db is unseeded
      const fallbackRoutes = [
        { id: '1', routeId: 'ahmedabad-mumbai', from: 'Ahmedabad', to: 'Mumbai', price: '₹900', time: '8 hrs 30 mins', type: 'Volvo A/C Sleeper', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?q=80&w=800&auto=format&fit=crop' },
        { id: '2', routeId: 'ahmedabad-pune', from: 'Ahmedabad', to: 'Pune', price: '₹1200', time: '11 hrs 45 mins', type: 'Scania Multi-Axle Sleeper', image: 'https://images.unsplash.com/photo-1514498308433-ed3e100ce613?q=80&w=800&auto=format&fit=crop' },
        { id: '3', routeId: 'ahmedabad-udaipur', from: 'Ahmedabad', to: 'Udaipur', price: '₹550', time: '5 hrs 15 mins', type: 'BharatBenz Premium Seater', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2403f55?q=80&w=800&auto=format&fit=crop' },
        { id: '4', routeId: 'ahmedabad-jaipur', from: 'Ahmedabad', to: 'Jaipur', price: '₹850', time: '10 hrs 30 mins', type: 'Volvo A/C Sleeper', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop' },
        { id: '5', routeId: 'ahmedabad-jodhpur', from: 'Ahmedabad', to: 'Jodhpur', price: '₹750', time: '8 hrs 45 mins', type: 'A/C Semi-Sleeper', image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?q=80&w=800&auto=format&fit=crop' },
      ];
      res.json(fallbackRoutes);
      return;
    }

    // Cache the result
    await setCache(ROUTES_CACHE_KEY, routes, ROUTES_CACHE_TTL);
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getRouteById = async (req: Request, res: Response): Promise<void> => {
  try {
    const route = await prisma.route.findUnique({
      where: { routeId: (req.params.i as string as string) },
    });
    if (!route) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createRoute = async (req: Request, res: Response) => {
  try {
    const newRoute = await prisma.route.create({
      data: req.body,
    });
    // Invalidate routes cache on mutation
    await invalidateCache(ROUTES_CACHE_KEY);
    res.status(201).json(newRoute);
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

export const deleteRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.route.delete({
      where: { id: (req.params.i as string as string) },
    });
    // Invalidate routes cache on mutation
    await invalidateCache(ROUTES_CACHE_KEY);
    res.json({ message: 'Route removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateRoute = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedRoute = await prisma.route.update({
      where: { id: (req.params.i as string as string) },
      data: req.body,
    });
    // Invalidate routes cache on mutation
    await invalidateCache(ROUTES_CACHE_KEY);
    res.json(updatedRoute);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const seedRoutes = async (req: Request, res: Response) => {
  res.json({ message: 'Use Prisma seed script to seed database.' });
};

export const getDynamicPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    const routeId = req.params.id as string;

    if (!date || typeof date !== 'string') {
      res.status(400).json({ message: 'Date query param required' });
      return;
    }

    const route = await prisma.route.findUnique({ where: { routeId } });
    if (!route) {
      res.status(404).json({ message: 'Route not found' });
      return;
    }

    // Calculate how many bookings exist for this route on this date
    const bookings = await prisma.booking.findMany({
      where: { routeId: route.id, date }
    });

    const totalPassengers = bookings.reduce((sum, b) => sum + b.passengers, 0);
    const busCapacity = 40; // Assuming standard Volvo capacity

    let currentPrice = parseFloat(route.price.replace(/[^0-9.-]+/g, ""));
    let dynamicFactor = 1.0;

    // Dynamic Pricing Logic: Increase by 20% if capacity > 80%
    // Increase by 10% if capacity > 50%
    if (totalPassengers >= busCapacity * 0.8) {
      dynamicFactor = 1.20;
    } else if (totalPassengers >= busCapacity * 0.5) {
      dynamicFactor = 1.10;
    }

    const finalPrice = Math.round(currentPrice * dynamicFactor);

    res.json({
      basePrice: currentPrice,
      dynamicPrice: finalPrice,
      factor: dynamicFactor,
      capacityBooked: Math.min(100, Math.round((totalPassengers / busCapacity) * 100)) + '%'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating dynamic price' });
  }
};
