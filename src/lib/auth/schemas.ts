import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Introduce un email válido.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export const SignupSchema = z.object({
  email: z.string().trim().toLowerCase().email('Introduce un email válido.'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .regex(/[A-Za-z]/, 'Debe incluir al menos una letra.')
    .regex(/[0-9]/, 'Debe incluir al menos un número.'),
});

export const ProfileSchema = z.object({
  full_name: z.string().trim().min(2, 'Indica tu nombre completo.').max(120),
  phone: z
    .string()
    .trim()
    .min(6, 'Introduce un teléfono válido.')
    .max(30)
    .regex(/^[0-9 +()-]+$/, 'Sólo dígitos, espacios y los símbolos + - ( ).'),
  address_line1: z.string().trim().min(2, 'Indica la dirección (calle y número).').max(200),
  address_line2: z.string().trim().max(200).optional().or(z.literal('')),
  city: z.string().trim().min(2, 'Indica la ciudad.').max(120),
  postal_code: z
    .string()
    .trim()
    .min(3, 'Indica el código postal.')
    .max(12)
    .regex(/^[A-Za-z0-9 -]+$/, 'Código postal no válido.'),
  country: z.string().trim().min(2).max(80).default('España'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type SignupInput = z.infer<typeof SignupSchema>;
export type ProfileInput = z.infer<typeof ProfileSchema>;
