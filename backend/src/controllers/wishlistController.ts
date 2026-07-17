import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const toggleWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { itemType, routeId, hotelId } = req.body;
    const userId = req.user.id;

    if (!itemType) {
      res.status(400).json({ message: 'itemType is required (route or hotel)' });
      return;
    }

    if (itemType === 'route' && !routeId) {
      res.status(400).json({ message: 'routeId is required for route wishlist' });
      return;
    }

    if (itemType === 'hotel' && !hotelId) {
      res.status(400).json({ message: 'hotelId is required for hotel wishlist' });
      return;
    }

    // Check if it already exists
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId,
        itemType,
        routeId: routeId || null,
        hotelId: hotelId || null
      }
    });

    if (existing) {
      // Remove it
      await prisma.wishlist.delete({ where: { id: existing.id } });
      res.status(200).json({ message: 'Removed from wishlist', isWishlisted: false });
    } else {
      // Add it
      await prisma.wishlist.create({
        data: {
          userId,
          itemType,
          routeId: routeId || null,
          hotelId: hotelId || null
        }
      });
      res.status(201).json({ message: 'Added to wishlist', isWishlisted: true });
    }
  } catch (error) {
    console.error('Error toggling wishlist:', error);
    res.status(500).json({ message: 'Failed to toggle wishlist' });
  }
};

export const getMyWishlist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const wishlist = await prisma.wishlist.findMany({
      where: { userId },
      include: {
        route: true,
        hotel: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};
