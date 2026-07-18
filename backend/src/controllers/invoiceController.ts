import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { generateTicketPDF } from '../utils/pdfGenerator';

// @desc    Generate invoice for a booking
// @route   POST /api/invoices/generate
// @access  Private/Admin
export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;

    // Check if invoice already exists
    const existing = await prisma.invoice.findUnique({ where: { bookingId } });
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

    const subtotal = parseFloat(booking.totalPrice as unknown as string) || 0;
    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
    const total = subtotal + tax;

    const items = [
      {
        description: `Bus Ticket: ${booking.route?.from || 'N/A'} → ${booking.route?.to || 'N/A'}`,
        quantity: booking.passengers,
        unitPrice: parseFloat(booking.route?.price?.replace('₹', '').replace(',', '') || '0'),
        total: subtotal,
      },
      {
        description: 'GST (5%)',
        quantity: 1,
        unitPrice: tax,
        total: tax,
      },
    ];

    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const invoice = await prisma.invoice.create({
      data: {
        bookingId,
        invoiceNumber,
        items: JSON.stringify(items),
        subtotal,
        tax,
        discount: 0,
        total,
        status: booking.paymentStatus === 'Paid' ? 'paid' : 'generated',
      },
    });

    res.status(201).json(invoice);
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating invoice', error: error.message });
  }
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private/Admin
export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { search, status, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(String(page)) - 1) * parseInt(String(limit));

    const where: any = {};
    if (status) where.status = String(status);
    if (search) {
      where.OR = [
        { invoiceNumber: { contains: String(search) } },
      ];
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          booking: {
            include: {
              route: { select: { from: true, to: true } },
              user: { select: { email: true, name: true } },
            },
          },
        },
        orderBy: { generatedAt: 'desc' },
        take: parseInt(String(limit)),
        skip,
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      invoices,
      total,
      page: parseInt(String(page)),
      pages: Math.ceil(total / parseInt(String(limit))),
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching invoices', error: error.message });
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id as string },
      include: {
        booking: {
          include: {
            route: true,
            user: { select: { email: true, name: true, phone: true } },
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// @desc    Get invoice by booking ID
// @route   GET /api/invoices/booking/:bookingId
// @access  Private
export const getInvoiceByBookingId = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { bookingId: req.params.bookingId as string },
      include: {
        booking: {
          include: {
            route: true,
            user: { select: { email: true, name: true } },
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found for this booking' });
      return;
    }

    res.json(invoice);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching invoice', error: error.message });
  }
};

// @desc    Download invoice as PDF
// @route   GET /api/invoices/:id/download
// @access  Private
export const downloadInvoicePDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id as string },
      include: {
        booking: { include: { route: true, user: true } },
      },
    });

    if (!invoice) {
      res.status(404).json({ message: 'Invoice not found' });
      return;
    }

    // Reuse the ticket PDF generator for invoice format
    const pdfBuffer = await generateTicketPDF(invoice.booking as any);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(500).json({ message: 'Error generating invoice PDF', error: error.message });
  }
};
