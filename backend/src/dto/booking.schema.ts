import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    serviceId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid service ID'),
    startDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid start date'),
    endDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid end date'),
    guests: z.number().int().min(1).optional(),
  }),
});
