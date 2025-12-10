import { z } from 'zod';

/**
 * Create Booking Validation Schema
 */
export const createBookingSchema = z.object({
  serviceId: z.string().min(1, 'Service ID is required'),
  serviceName: z.string().min(1, 'Service name is required').trim(),
  date: z.string().min(1, 'Date is required').trim(),
  time: z.string().min(1, 'Time is required').trim(),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address cannot exceed 500 characters')
    .trim(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .trim(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').trim().optional(),
});

/**
 * Update Booking Validation Schema
 */
export const updateBookingSchema = z.object({
  date: z.string().min(1, 'Date is required').trim().optional(),
  time: z.string().min(1, 'Time is required').trim().optional(),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(500, 'Address cannot exceed 500 characters')
    .trim()
    .optional(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .trim()
    .optional(),
  status: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled'])
    .optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').trim().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;



