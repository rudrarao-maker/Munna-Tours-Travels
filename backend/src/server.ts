import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Middlewares
import { generalLimiter, authLimiter, paymentLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { auditLog } from './middlewares/auditMiddleware';

// Config
import { initRedis } from './config/redis';

// Routes — Core
import authRoutes from './routes/authRoutes';
import routeRoutes from './routes/routeRoutes';
import quoteRoutes from './routes/quoteRoutes';
import vehicleRoutes from './routes/vehicleRoutes';
import bookingRoutes from './routes/bookingRoutes';
import driverRoutes from './routes/driverRoutes';
import reviewRoutes from './routes/reviewRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import aiRoutes from './routes/aiRoutes';
import paymentRoutes from './routes/paymentRoutes';
import couponRoutes from './routes/couponRoutes';

// Routes — New Modules
import hotelRoutes from './routes/hotelRoutes';
import notificationRoutes from './routes/notificationRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import invoiceRoutes from './routes/invoiceRoutes';
import eticketRoutes from './routes/eticketRoutes';
import fleetRoutes from './routes/fleetRoutes';
import trackingRoutes from './routes/trackingRoutes';
import reportRoutes from './routes/reportRoutes';
import blogRoutes from './routes/blogRoutes';
import wishlistRoutes from './routes/wishlistRoutes';
import uploadRoutes from './routes/uploadRoutes';
import packageRoutes from './routes/packageRoutes';

dotenv.config();

const app = express();
export const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Global Middlewares
app.use(helmet());
app.use(cors({ 
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(auditLog());
app.use(generalLimiter); // Apply general rate limiting to all routes

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// ─── Socket.io for Real-Time Features ───────────────────────────

// Track connected clients
const connectedClients = new Map<string, { type: string; userId?: string }>();

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Client identifies itself (customer tracking or driver broadcasting)
  socket.on('identify', (data: { type: string; userId?: string; driverId?: string }) => {
    connectedClients.set(socket.id, { type: data.type, userId: data.userId });
    
    if (data.type === 'driver' && data.driverId) {
      socket.join(`driver-${data.driverId}`);
    }
    if (data.type === 'admin') {
      socket.join('admin-room');
    }
  });

  // Join a tracking room for a specific booking
  socket.on('track-booking', (bookingId: string) => {
    socket.join(`booking-${bookingId}`);
    console.log(`${socket.id} tracking booking: ${bookingId}`);
  });

  // Join fleet tracking room
  socket.on('track-fleet', () => {
    socket.join('fleet-tracking');
  });

  // Driver broadcasts location update
  socket.on('driver-location', (data: {
    driverId: string;
    vehicleId?: string;
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
  }) => {
    // Broadcast to admin fleet tracking
    io.to('fleet-tracking').emit('vehicle-position', data);
    
    // Broadcast to customers tracking this specific vehicle/driver
    io.to(`driver-${data.driverId}`).emit('driver-position', data);
    
    // Also emit to any booking-specific rooms
    io.to('admin-room').emit('fleet-update', data);
  });

  // New booking notification (emitted from API)
  socket.on('new-booking', (bookingData: any) => {
    io.to('admin-room').emit('booking-notification', bookingData);
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Make io accessible to controllers
app.set('io', io);

// ─── API Routes ─────────────────────────────────────────────────

// Core routes (with specific rate limiters where needed)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/payments', paymentLimiter, paymentRoutes);
app.use('/api/coupons', couponRoutes);

// New module routes
app.use('/api/hotels', hotelRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/etickets', eticketRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/packages', packageRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    modules: [
      'auth', 'routes', 'quotes', 'vehicles', 'bookings', 'drivers',
      'reviews', 'analytics', 'ai', 'payments', 'coupons', 'hotels',
      'notifications', 'feedback', 'invoices', 'etickets',
      'fleet', 'tracking', 'reports'
    ],
    connectedSockets: connectedClients.size,
  });
});

app.get('/', (req, res) => {
  res.send('Munna Tours & Travels API is running — AI Smart Tourism & Transport Management System v2.0');
});

// Global Error Handler
app.use(errorHandler);

// Initialize Redis (non-blocking, app works without it)
initRedis().catch(() => {
  console.warn('Redis initialization skipped — running without cache');
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io ready for real-time connections`);
  console.log(`🧩 20 API modules loaded`);
});
