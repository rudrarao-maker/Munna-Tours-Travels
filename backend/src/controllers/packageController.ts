import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { getCache, setCache, invalidateCachePattern } from '../config/redis';
import { AppError } from '../utils/AppError';

export const getAllPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.pag as string as string) || 1;
    const limit = parseInt(req.query.limi as string as string) || 10;
    const skip = (page - 1) * limit;

    const cacheKey = `packages:all:page:${page}:limit:${limit}`;
    const cachedPackages = await getCache(cacheKey);
    
    if (cachedPackages) {
      res.status(200).json(cachedPackages);
      return;
    }

    const [packages, total] = await Promise.all([
      prisma.tourPackage.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tourPackage.count()
    ]);
    
    const response = {
      packages,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    await setCache(cacheKey, response, 300); // Cache for 5 mins
    
    res.status(200).json(response);
  } catch (error: any) {
    next(new AppError('Failed to fetch packages', 500));
  }
};

export const getPackageByIdOrSlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const tourPackage = await prisma.tourPackage.findFirst({
      where: {
        OR: [
          { id },
          { slug: id }
        ]
      }
    });

    if (!tourPackage) {
      return next(new AppError('Package not found', 404));
    }

    res.status(200).json(tourPackage);
  } catch (error: any) {
    next(new AppError('Failed to fetch package', 500));
  }
};

export const createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    await invalidateCachePattern('packages:*');

    res.status(201).json(newPackage);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to create package', 500));
  }
};

export const updatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
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

    await invalidateCachePattern('packages:*');

    res.status(200).json(updatedPackage);
  } catch (error: any) {
    next(new AppError(error.message || 'Failed to update package', 500));
  }
};

export const deletePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    await prisma.tourPackage.delete({
      where: { id }
    });
    await invalidateCachePattern('packages:*');
    res.status(200).json({ message: 'Package deleted successfully' });
  } catch (error: any) {
    next(new AppError('Failed to delete package', 500));
  }
};
