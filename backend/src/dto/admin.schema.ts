import { z } from 'zod';

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    role: z.enum(['user', 'event_owner', 'admin']),
  }),
});

export const toggleBlockSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid user ID'),
  }),
  body: z.object({
    isBlocked: z.boolean(),
  }),
});
