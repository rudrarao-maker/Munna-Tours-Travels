import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const newVehicle = await prisma.vehicle.create({
      data: req.body,
    });
    res.status(201).json(newVehicle);
  } catch (error: any) {
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
};

export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedVehicle = await prisma.vehicle.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updatedVehicle);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    await prisma.vehicle.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
