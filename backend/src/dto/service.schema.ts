import { z } from 'zod';

export const createServiceSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    category: z.string().min(1).max(100),
    location: z.string().min(1).max(300),
    lat: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    lng: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
    pricePerDay: z.preprocess((val) => Number(val), z.number().positive()),
    description: z.string().min(1).max(5000),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    contactDetails: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  }),
});

export const serviceIdParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid service ID'),
  }),
});
