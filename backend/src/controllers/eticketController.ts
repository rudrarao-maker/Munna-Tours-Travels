import { Request, Response } from 'express';
import prisma from '../config/prisma';
import crypto from 'crypto';

// @desc    Generate e-ticket for a booking
// @route   POST /api/etickets/generate
// @access  Private
export const generateETicket = async (req: Request, res: Response) => {
  try {
    const { bookingId, boardingPoint, seatNumbers } = req.body;

    // Check if e-ticket already exists
    const existing = await prisma.eTicket.findUnique({ where: { bookingId } });
    if (existing) {
      res.json(existing);
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { route: true, user: true },
    });

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    // Generate unique ticket number
    const ticketNumber = `MT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Generate QR code data (encoded booking info + verification hash)
    const qrPayload = {
      ticketNumber,
      bookingId: booking.id,
      route: `${booking.route?.from} → ${booking.route?.to}`,
      date: booking.date,
      passengers: booking.passengers,
      timestamp: Date.now(),
    };

    const hash = crypto.createHash('sha256')
      .update(JSON.stringify(qrPayload) + (process.env.JWT_SECRET || 'fallback_secret_key'))
      .digest('hex')
      .substring(0, 12);

    const qrCodeData = JSON.stringify({ ...qrPayload, hash });

    const eTicket = await prisma.eTicket.create({
      data: {
        bookingId,
        ticketNumber,
        qrCodeData,
        validFrom: booking.date,
        validTo: booking.date, // Same day validity
        boardingPoint: boardingPoint || '',
        seatNumbers: seatNumbers || '',
      },
    });

    res.status(201).json(eTicket);
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating e-ticket', error: error.message });
  }
};

// @desc    Get e-ticket by booking ID
// @route   GET /api/etickets/booking/:bookingId
// @access  Public
export const getETicketByBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const eTicket = await prisma.eTicket.findUnique({
      where: { bookingId: req.params.bookingId },
      // Note: Prisma SQLite doesn't support nested includes deeply, so we do a separate query
    });

    if (!eTicket) {
      res.status(404).json({ message: 'E-Ticket not found for this booking' });
      return;
    }

    // Fetch booking details separately
    const booking = await prisma.booking.findUnique({
      where: { id: eTicket.bookingId },
      include: { route: true, user: { select: { email: true, name: true } } },
    });

    res.json({ ...eTicket, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching e-ticket', error: error.message });
  }
};

// @desc    Get e-ticket by ticket number
// @route   GET /api/etickets/:ticketNumber
// @access  Public
export const getETicketByNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const eTicket = await prisma.eTicket.findUnique({
      where: { ticketNumber: req.params.ticketNumber },
    });

    if (!eTicket) {
      res.status(404).json({ message: 'E-Ticket not found' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: eTicket.bookingId },
      include: { route: true, user: { select: { email: true, name: true } } },
    });

    res.json({ ...eTicket, booking });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching e-ticket', error: error.message });
  }
};

// @desc    Scan/validate QR code
// @route   POST /api/etickets/scan
// @access  Private/Driver
export const scanETicket = async (req: Request, res: Response) => {
  try {
    const { qrData } = req.body;
    const parsed = JSON.parse(qrData);

    // Verify hash
    const { hash, ...payload } = parsed;
    const expectedHash = crypto.createHash('sha256')
      .update(JSON.stringify(payload) + (process.env.JWT_SECRET || 'fallback_secret_key'))
      .digest('hex')
      .substring(0, 12);

    if (hash !== expectedHash) {
      res.status(400).json({ valid: false, message: 'Invalid QR code — tampered data detected' });
      return;
    }

    const eTicket = await prisma.eTicket.findUnique({
      where: { ticketNumber: parsed.ticketNumber },
    });

    if (!eTicket) {
      res.status(404).json({ valid: false, message: 'Ticket not found' });
      return;
    }

    if (eTicket.isScanned) {
      res.status(400).json({ valid: false, message: 'Ticket already scanned', scannedAt: eTicket.scannedAt });
      return;
    }

    // Mark as scanned
    await prisma.eTicket.update({
      where: { id: eTicket.id },
      data: { isScanned: true, scannedAt: new Date() },
    });

    const booking = await prisma.booking.findUnique({
      where: { id: eTicket.bookingId },
      include: { route: true, user: { select: { name: true, email: true } } },
    });

    res.json({
      valid: true,
      message: 'Ticket verified successfully',
      ticket: eTicket,
      booking,
    });
  } catch (error: any) {
    res.status(400).json({ valid: false, message: 'Invalid QR code format', error: error.message });
  }
};
