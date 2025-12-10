import { z } from 'zod';

/**
 * Create Service Validation Schema
 */
export const createServiceSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .trim(),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .trim(),
  category: z.enum(['electrician', 'ac'], {
    errorMap: () => ({ message: 'Category must be either electrician or ac' }),
  }),
  price: z.number().min(0, 'Price cannot be negative'),
  duration: z.string().min(1, 'Duration is required').trim(),
  image: z.string().url('Image must be a valid URL').trim(),
  features: z.array(z.string().trim()).optional().default([]),
  rating: z.number().min(0).max(5).optional().default(0),
  reviews: z.number().min(0).optional().default(0),
});

/**
 * Update Service Validation Schema
 */
export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;



