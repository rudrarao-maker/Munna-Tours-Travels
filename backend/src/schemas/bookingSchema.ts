import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    routeId: z.string().min(1, 'Route ID is required'),
    date: z.string().min(1, 'Date is required'),
    passengers: z.union([z.string(), z.number()]).transform(val => parseInt(String(val))),
    userId: z.string().optional(),
    userEmail: z.string().email().optional().or(z.literal('')),
    vehicleType: z.string().optional(),
    mealPlan: z.string().optional(),
    hotelId: z.string().optional().nullable(),
    basePrice: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
    vehiclePrice: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))).optional(),
    mealPrice: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))).optional(),
    hotelPrice: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))).optional(),
    taxes: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))).optional(),
    totalPrice: z.union([z.string(), z.number()]).transform(val => parseFloat(String(val))),
  }),
});
