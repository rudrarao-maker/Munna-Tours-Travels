import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// In a real app, load these from process.env
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_mock123';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'mock_secret_123';

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order
// @route   POST /api/payments/create-order
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    const options = {
      amount: parseInt(amount) * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency,
      receipt,
    };

    // If using mock keys, we just mock the response
    if (RAZORPAY_KEY_ID.includes('mock')) {
      return res.json({
        id: 'order_mock_' + Date.now(),
        amount: options.amount,
        currency,
      });
    }

    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Public
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // If mock, just approve it
    if (RAZORPAY_KEY_ID.includes('mock')) {
      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'Paid' }
        });
      }
      return res.json({ success: true, message: 'Payment verified (Mock)' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      if (bookingId) {
        // Update booking status in DB
        await prisma.booking.update({
          where: { id: bookingId },
          data: { paymentStatus: 'Paid' }
        });
      }
      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error verifying payment', error: error.message });
  }
};
