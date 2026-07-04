import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAndSendPDF } from '../utils/emailService';

const prisma = new PrismaClient();

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        route: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
      include: { route: true, user: true }
    });
    if (booking) {
      res.json(booking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching booking', error: error.message });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Public/Private
export const createBooking = async (req: Request, res: Response) => {
  try {
    const { routeId, date, passengers, totalPrice, userId, userEmail } = req.body;
    const booking = await prisma.booking.create({
      data: {
        routeId,
        date,
        passengers: parseInt(passengers),
        totalPrice: totalPrice.toString(),
        userId
      }
    });

    // Generate PDF and Send Email (non-blocking)
    if (userEmail) {
      generateAndSendPDF(booking, userEmail).catch(err => console.error('Failed to send email/PDF:', err));
    }

    res.status(201).json(booking);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// @desc    Update a booking status
// @route   PUT /api/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await prisma.booking.update({
      where: { id: (req.params.id as string) },
      data: { status, paymentStatus }
    });
    res.json(booking);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating booking', error: error.message });
  }
};
