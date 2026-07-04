import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { sendEmail } from '../utils/sendEmail';

export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const newQuote = await prisma.quoteRequest.create({
      data: req.body,
    });

    // Send confirmation email to customer
    await sendEmail({
      email: newQuote.email,
      subject: 'Quote Request Received - Munna Travels',
      message: `Hi ${newQuote.contactName},\n\nWe have received your charter request from ${newQuote.pickup} to ${newQuote.dropoff}.\nOur team is calculating the best rate and will get back to you shortly.\n\nThank you,\nMunna Travels Team`,
    });

    // Send notification email to admin
    await sendEmail({
      email: process.env.ADMIN_EMAIL || 'admin@munna.com',
      subject: 'New Quote Request',
      message: `New Quote Alert!\n\n${newQuote.passengers} passengers from ${newQuote.pickup} to ${newQuote.dropoff}.\nContact: ${newQuote.contactName} (${newQuote.phone})\n\nLogin to ERP to view full details.`,
    });

    res.status(201).json(newQuote);
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

export const getQuoteRequests = async (req: Request, res: Response) => {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateQuoteStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const quote = await prisma.quoteRequest.update({
      where: { id: req.params.id },
      data: { status: req.body.status },
    });
    res.json(quote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
