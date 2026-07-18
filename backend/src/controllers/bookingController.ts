import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAndSendPDF } from '../utils/emailService';
import { generateTicketPDF } from '../utils/pdfGenerator';
import { AppError } from '../utils/AppError';
import { emailQueue } from '../utils/queue';
import { io } from '../server';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        skip,
        take: limit,
        include: {
          route: true,
          user: true,
          hotel: true,
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.booking.count()
    ]);
    
    res.status(200).json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    next(new AppError('Error fetching bookings', 500));
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
      include: { route: true, user: true, hotel: true }
    });
    if (booking) {
      if (req.user?.role !== 'admin' && booking.userId !== req.user?.id) {
        return next(new AppError('Not authorized to view this booking', 403));
      }
      res.json(booking);
    } else {
      next(new AppError('Booking not found', 404));
    }
  } catch (error: any) {
    next(new AppError('Error fetching booking', 500));
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public/Private
export const createBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      routeId, date, passengers, userId, userEmail,
      vehicleType, mealPlan, hotelId, 
      basePrice, vehiclePrice, mealPrice, hotelPrice, taxes, totalPrice,
      seats
    } = req.body;
    
    const booking = await prisma.booking.create({
      data: {
        routeId,
        date,
        passengers: parseInt(passengers),
        userId,
        vehicleType: vehicleType || 'volvo bus',
        mealPlan: mealPlan || 'none',
        hotelId: hotelId || null,
        basePrice: parseFloat(basePrice) || 0,
        vehiclePrice: parseFloat(vehiclePrice) || 0,
        mealPrice: parseFloat(mealPrice) || 0,
        hotelPrice: parseFloat(hotelPrice) || 0,
        taxes: parseFloat(taxes) || 0,
        totalPrice: parseFloat(totalPrice) || 0,
        seats: JSON.stringify(seats || []),
      }
    });

    // Add email task to the background queue
    if (userEmail) {
      await emailQueue.add('sendBookingConfirmation', { booking, userEmail });
    }

    // Emit real-time events for live seat availability
    io.emit('booking_created', { bookingId: booking.id, routeId: booking.routeId });
    io.emit('seat_locked', { routeId: booking.routeId, passengers: booking.passengers, date: booking.date });

    res.status(201).json(booking);
  } catch (error: any) {
    next(new AppError('Error creating booking', 500));
  }
};

// @desc    Update a booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await prisma.booking.update({
      where: { id: (req.params.id as string) },
      data: { status, paymentStatus }
    });
    
    // Emit booking update
    io.emit('booking_updated', { bookingId: booking.id, status, paymentStatus });
    
    res.json(booking);
  } catch (error: any) {
    next(new AppError('Error updating booking', 500));
  }
};

// @desc    Download e-ticket PDF for a booking
// @route   GET /api/bookings/:id/ticket
// @access  Public
export const downloadTicket = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
      include: { route: true, user: true, hotel: true }
    });

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (req.user?.role !== 'admin' && booking.userId !== req.user?.id) {
      return next(new AppError('Not authorized to view this ticket', 403));
    }

    const pdfBuffer = await generateTicketPDF(booking);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=MunnaTravels_Ticket_${booking.id.slice(0, 8)}.pdf`,
      'Content-Length': pdfBuffer.length.toString(),
    });

    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error generating ticket PDF:', error);
    next(new AppError('Error generating ticket', 500));
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public (should ideally be protected, but keeping public for demo)
export const cancelBooking = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
    });

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (req.user?.role !== 'admin' && booking.userId !== req.user?.id) {
      return next(new AppError('Not authorized to cancel this booking', 403));
    }

    if (booking.status === 'Cancelled') {
      return next(new AppError('Booking is already cancelled', 400));
    }

    const departureDate = new Date(booking.date);
    const now = new Date();
    const hoursToDeparture = (departureDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = 0;
    const totalPrice = booking.totalPrice || 0;

    if (hoursToDeparture > 24) {
      refundAmount = totalPrice; // Full refund
    } else if (hoursToDeparture > 0 && hoursToDeparture <= 24) {
      refundAmount = totalPrice * 0.5; // 50% refund
    } else {
      refundAmount = 0; // No refund if already departed or negative
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'Cancelled' },
    });

    res.json({
      message: 'Booking cancelled successfully',
      refundAmount,
      booking: updatedBooking
    });
  } catch (error: any) {
    next(new AppError('Error cancelling booking', 500));
  }
};
