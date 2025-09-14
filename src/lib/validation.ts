import { z } from 'zod';

// Product validation schema
export const productValidationSchema = z.object({
  name: z.string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters'),
  
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must be less than 500 characters'),
  
  detailedDescription: z.string()
    .max(2000, 'Detailed description must be less than 2000 characters')
    .optional(),
  
  category: z.string()
    .min(1, 'Category is required'),
  
  price: z.string()
    .min(1, 'Price is required')
    .regex(/^₹?\d+(\.\d{1,2})?$/, 'Please enter a valid price (e.g., ₹299 or 299.99)'),
  
  originalPrice: z.string()
    .regex(/^₹?\d+(\.\d{1,2})?$/, 'Please enter a valid price')
    .optional()
    .or(z.literal('')),
  
  image: z.string()
    .url('Main image is required')
    .min(1, 'Main image is required'),
  
  images: z.array(z.string().url()).optional(),
  
  inStock: z.boolean(),
  
  variants: z.array(z.object({
    name: z.string().min(1, 'Variant name is required'),
    price: z.number().min(0, 'Price must be positive'),
    originalPrice: z.number().min(0, 'Original price must be positive').optional(),
    stock: z.number().int().min(0, 'Stock must be a non-negative integer'),
    isDefault: z.boolean().optional()
  })).optional(),
  
  nutritionalInfo: z.string().max(1000, 'Nutritional info must be less than 1000 characters').optional(),
  ingredients: z.string().max(1000, 'Ingredients must be less than 1000 characters').optional(),
  origin: z.string().max(100, 'Origin must be less than 100 characters').optional(),
  weight: z.string().max(50, 'Weight must be less than 50 characters').optional(),
  dimensions: z.string().max(100, 'Dimensions must be less than 100 characters').optional()
});

// Admin login validation schema
export const adminLoginSchema = z.object({
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .min(1, 'Password is required')
});

// Order status validation schema
export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  trackingNumber: z.string()
    .min(3, 'Tracking number must be at least 3 characters')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

// Product request validation schema
export const productRequestStatusSchema = z.object({
  status: z.enum(['pending', 'quote_sent', 'approved', 'rejected', 'completed']),
  quotedPrice: z.number()
    .min(0, 'Quoted price must be positive')
    .optional(),
  estimatedDelivery: z.string()
    .max(100, 'Estimated delivery must be less than 100 characters')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
});

// Security validation functions
export const validateAdminAccess = (userRole: string | undefined): boolean => {
  return userRole === 'admin';
};

export const validateImageUrl = (url: string): boolean => {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  } catch {
    return false;
  }
};

export const validatePrice = (price: string): boolean => {
  const priceRegex = /^₹?\d+(\.\d{1,2})?$/;
  return priceRegex.test(price);
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

export const validateFileType = (file: File, allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']): boolean => {
  return allowedTypes.includes(file.type);
};

// Rate limiting helper (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (identifier: string, maxRequests: number = 5, windowMs: number = 60000): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count++;
  return true;
};

// Input sanitization for search queries
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .slice(0, 100) // Limit length
    .replace(/[<>]/g, '') // Remove potential XSS characters
    .replace(/['"]/g, ''); // Remove quotes to prevent injection
};

// Validation error formatter
export const formatValidationErrors = (errors: z.ZodError): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  errors.errors.forEach((error) => {
    const path = error.path.join('.');
    formattedErrors[path] = error.message;
  });
  
  return formattedErrors;
};

// Generic form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: formatValidationErrors(error) };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): { isStrong: boolean; feedback: string[] } => {
  const feedback: string[] = [];
  let isStrong = true;
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
    isStrong = false;
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
    isStrong = false;
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
    isStrong = false;
  }
  
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
    isStrong = false;
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    feedback.push('Password must contain at least one special character');
    isStrong = false;
  }
  
  return { isStrong, feedback };
};

export type ValidationResult<T> = {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
};