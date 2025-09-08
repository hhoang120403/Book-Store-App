import { z } from 'zod';

export const AuthSchema = z
  .object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(3, 'Name is required').optional(),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password is required')
      .optional(),
  })
  .refine(
    (data) => !data.confirmPassword || data.password === data.confirmPassword,
    {
      path: ['confirmPassword'],
      message: "Passwords don't match",
    }
  );

export const AdminLoginSchema = AuthSchema.pick({
  email: true,
  password: true,
});

export type AdminLoginFormData = z.infer<typeof AdminLoginSchema>;

export type AuthFormData = z.infer<typeof AuthSchema>;
