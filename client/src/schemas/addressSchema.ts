import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(3, 'First name is required'),
  lastName: z.string().min(3, 'Last name is required'),
  email: z.email('Invalid email'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(3, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipcode: z.string().min(3, 'Zip code is required'),
  country: z.string().min(3, 'Country is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
