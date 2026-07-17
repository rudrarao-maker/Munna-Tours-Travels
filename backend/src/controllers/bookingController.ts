import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAndSendPDF } from '../utils/emailService';
import { generateTicketPDF } from '../utils/pdfGenerator';

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
        hotel: true,
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
      include: { route: true, user: true, hotel: true }
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
    const { 
      routeId, date, passengers, userId, userEmail,
      vehicleType, mealPlan, hotelId, 
      basePrice, vehiclePrice, mealPrice, hotelPrice, taxes, totalPrice 
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

// @desc    Download e-ticket PDF for a booking
// @route   GET /api/bookings/:id/ticket
// @access  Public
export const downloadTicket = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
      include: { route: true, user: true, hotel: true }
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
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
    res.status(500).json({ message: 'Error generating ticket', error: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Public (should ideally be protected, but keeping public for demo)
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: (req.params.id as string) },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (booking.status === 'Cancelled') {
      res.status(400).json({ message: 'Booking is already cancelled' });
      return;
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
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};
