import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Validate a coupon code
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, amount } = req.body;

    if (!code) {
      res.status(400).json({ message: 'Coupon code is required' });
      return;
    }

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      res.status(404).json({ message: 'Invalid coupon code' });
      return;
    }

    if (!coupon.isActive) {
      res.status(400).json({ message: 'This coupon is no longer active' });
      return;
    }

    const now = new Date();
    if (now < coupon.validFrom) {
      res.status(400).json({ message: 'This coupon is not yet valid' });
      return;
    }
    if (now > coupon.validUntil) {
      res.status(400).json({ message: 'This coupon has expired' });
      return;
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.status(400).json({ message: 'This coupon has reached its usage limit' });
      return;
    }

    const bookingAmount = parseFloat(amount) || 0;
    if (bookingAmount < coupon.minAmount) {
      res.status(400).json({ message: `Minimum booking amount of ₹${coupon.minAmount} required for this coupon` });
      return;
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (bookingAmount * coupon.discount) / 100;
    } else {
      discountAmount = coupon.discount;
    }

    // Discount cannot exceed booking amount
    discountAmount = Math.min(discountAmount, bookingAmount);

    res.json({
      valid: true,
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalAmount: Math.round((bookingAmount - discountAmount) * 100) / 100,
      message: coupon.type === 'percentage'
        ? `${coupon.discount}% off applied!`
        : `₹${coupon.discount} off applied!`,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error validating coupon', error: error.message });
  }
};

// @desc    Apply a coupon (increment usage count)
// @route   POST /api/coupons/apply
// @access  Public
export const applyCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

    if (!coupon) {
      res.status(404).json({ message: 'Coupon not found' });
      return;
    }

    await prisma.coupon.update({
      where: { id: coupon.id },
      data: { usedCount: coupon.usedCount + 1 },
    });

    res.json({ message: 'Coupon applied successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error applying coupon', error: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
export const getCoupons = async (req: Request, res: Response) => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching coupons', error: error.message });
  }
};

// @desc    Create a coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req: Request, res: Response) => {
  try {
    const { code, discount, type, maxUses, minAmount, validFrom, validUntil } = req.body;

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discount: parseFloat(discount),
        type: type || 'percentage',
        maxUses: parseInt(maxUses) || 100,
        minAmount: parseFloat(minAmount) || 0,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: new Date(validUntil),
      },
    });

    res.status(201).json(coupon);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'A coupon with this code already exists' });
    } else {
      res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
  }
};

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = async (req: Request, res: Response) => {
  try {
    await prisma.coupon.delete({ where: { id: req.params.id as string } });
    res.json({ message: 'Coupon deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting coupon', error: error.message });
  }
};
