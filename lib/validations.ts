import { z } from "zod";
import { createSchema } from "./zodValidator";

// Email validation
const emailSchema = createSchema(
  (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  "Please enter a valid email address"
);

// Phone number validation (Nigerian format) - numbers only
const phoneSchema = createSchema(
  (value) => /^(\+234|0)?[789][01]\d{8}$/.test(value.replace(/\D/g, '')),
  "Please enter a valid Nigerian phone number (numbers only)"
);

// Password validation
const passwordSchema = createSchema(
  (value) => value.length > 4,
  "Password must be more than 4 characters"
);

// Account number validation
const accountNumberSchema = createSchema(
  (value) => /^\d{10}$/.test(value),
  "Account number must be exactly 10 digits"
);

// BVN validation
const bvnSchema = createSchema(
  (value) => /^\d{11}$/.test(value),
  "BVN must be exactly 11 digits"
);

// Address validation
const addressSchema = createSchema(
  (value) => value.length >= 10 && value.length <= 200,
  "Address must be between 10-200 characters"
);

// IPPIS validation
const ippisSchema = createSchema(
  (value) => /^\d{8,12}$/.test(value),
  "IPPIS number must be 8-12 digits"
);

// Institution validation
const institutionSchema = createSchema(
  (value) => value.length >= 2 && value.length <= 100,
  "Institution name must be between 2-100 characters"
);

// Referral code validation (optional)
const referralCodeSchema = z.string().optional().refine(
  (value) => !value || (value.length >= 3 && value.length <= 20),
  { message: "Referral code must be between 3-20 characters" }
);

// Signup Step 1 Schema
export const signupStep1Schema = z.object({
  email: z.string().optional(),
  phone: z.string().optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  referredBy: referralCodeSchema,
}).refine((data) => {
  // At least one of email or phone must be provided
  return (data.email && emailSchema.safeParse(data.email).success) || 
         (data.phone && phoneSchema.safeParse(data.phone).success);
}, {
  message: "Please provide either a valid email address or phone number",
  path: ["email"],
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Signup Step 2 Schema
export const signupStep2Schema = z.object({
  accountNumber: accountNumberSchema,
  bankName: z.string().min(1, "Please select a bank"),
  bvn: bvnSchema,
});

// Signup Step 3 Schema
export const signupStep3Schema = z.object({
  address: addressSchema,
  ippis: ippisSchema,
  institution: institutionSchema,
});

// Login Schema (email or phone)
export const loginSchema = z.object({
  email: z.string().min(1, "Email/Phone is required"),
  password: z.string().min(1, "Password is required"),
});

// Validation helper function
export function validateForm(schema: z.ZodSchema, data: any) {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        const field = err.path[0] as string;
        acc[field] = err.message;
        return acc;
      }, {} as Record<string, string>);
      return { success: false, errors };
    }
    return { success: false, errors: { general: "Validation failed" } };
  }
} 