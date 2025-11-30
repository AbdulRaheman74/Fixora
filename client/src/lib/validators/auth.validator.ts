/**
 * Auth Validation - Simple Version
 * Yeh file user input validate karne ke liye hai
 * Basic validation functions (Zod optional, simple checks)
 */

/**
 * Function: Register Data Validate Karo
 * Check karo ki registration data theek hai ya nahi
 */
export function validateRegister(data: any) {
  const errors: string[] = [];

  // Name check
  if (!data.name || data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Email check
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Phone check
  if (!data.phone || data.phone.trim().length < 10) {
    errors.push('Valid phone number is required');
  }

  // Password check
  if (!data.password || data.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    data: errors.length === 0 ? {
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      password: data.password,
    } : null,
  };
}

/**
 * Function: Login Data Validate Karo
 * Check karo ki login data theek hai ya nahi
 */
export function validateLogin(data: any) {
  const errors: string[] = [];

  // Email check
  if (!data.email || !data.email.includes('@')) {
    errors.push('Valid email is required');
  }

  // Password check
  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    data: errors.length === 0 ? {
      email: data.email.toLowerCase().trim(),
      password: data.password,
    } : null,
  };
}

// Zod schemas (optional - for advanced validation)
import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  email: z.string().email().toLowerCase().trim(),
  phone: z.string().min(10).max(15).trim(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1),
});
