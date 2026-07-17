import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllPackages = async (req: Request, res: Response): Promise<void> => {
  try {
    const packages = await prisma.tourPackage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(packages);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch packages' });
  }
};

export const getPackageByIdOrSlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const tourPackage = await prisma.tourPackage.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!tourPackage) {
      res.status(404).json({ message: 'Package not found' });
      return;
    }

    res.status(200).json(tourPackage);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch package' });
  }
};

export const createPackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    
    // Auto generate slug if not provided
    if (!data.slug) {
      data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }

    const newPackage = await prisma.tourPackage.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        destination: data.destination,
        duration: data.duration,
        price: data.price,
        category: data.category,
        images: typeof data.images === 'string' ? data.images : JSON.stringify(data.images || []),
        itinerary: typeof data.itinerary === 'string' ? data.itinerary : JSON.stringify(data.itinerary || []),
        includes: typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes || []),
        excludes: typeof data.excludes === 'string' ? data.excludes : JSON.stringify(data.excludes || []),
        isPopular: data.isPopular || false
      }
    });

    res.status(201).json(newPackage);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create package' });
  }
};

export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedPackage = await prisma.tourPackage.update({
      where: { id },
      data: {
        ...data,
        images: data.images ? (typeof data.images === 'string' ? data.images : JSON.stringify(data.images)) : undefined,
        itinerary: data.itinerary ? (typeof data.itinerary === 'string' ? data.itinerary : JSON.stringify(data.itinerary)) : undefined,
        includes: data.includes ? (typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes)) : undefined,
        excludes: data.excludes ? (typeof data.excludes === 'string' ? data.excludes : JSON.stringify(data.excludes)) : undefined,
      }
    });

    res.status(200).json(updatedPackage);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update package' });
  }
};

export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.tourPackage.delete({
      where: { id }
    });
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to delete package' });
  }
};
