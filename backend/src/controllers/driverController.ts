import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private/Admin
export const getDrivers = async (req: Request, res: Response) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(drivers);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching drivers', error: error.message });
  }
};

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private/Admin
export const createDriver = async (req: Request, res: Response) => {
  try {
    const { name, license, phone, status } = req.body;
    const driver = await prisma.driver.create({
      data: { name, license, phone, status }
    });
    res.status(201).json(driver);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating driver', error: error.message });
  }
};

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Private/Admin
export const updateDriver = async (req: Request, res: Response) => {
  try {
    const { name, license, phone, status } = req.body;
    const driver = await prisma.driver.update({
      where: { id: (req.params.id as string) },
      data: { name, license, phone, status }
    });
    res.json(driver);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating driver', error: error.message });
  }
};

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Private/Admin
export const deleteDriver = async (req: Request, res: Response) => {
  try {
    await prisma.driver.delete({
      where: { id: (req.params.id as string) }
    });
    res.json({ message: 'Driver removed' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting driver', error: error.message });
  }
};
