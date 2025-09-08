import z from 'zod';
import { categories } from '../constants/categories';

export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Product description is required'),
  category: z.enum(categories),
  price: z
    .string()
    .regex(/^\d+$/, 'Price must be greater than 0')
    .min(1, 'Price is required'),
  offerPrice: z
    .string()
    .regex(/^\d+$/, 'Offer price must be greater than 0')
    .min(1, 'Offer price is required'),
  popular: z.boolean(),
  files: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(4, 'Maximum 4 images allowed'),
});

export type ProductFormData = z.infer<typeof ProductSchema>;
