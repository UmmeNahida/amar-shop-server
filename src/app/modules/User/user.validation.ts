import { z } from "zod";

export const createUserValidationSchema = z.object({
    fullName: z
      .string({
        error: "Full name is required",
      })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name cannot exceed 50 characters"),

    email: z
      .string({
       error: "Email is required",
      })
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .regex(
        /^(?:\+8801|01)[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number"
      )
      .optional(),

    password: z
      .string({
        error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters")
      .max(100)
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character"
      ),
  })

export const UserValidation = {
  createUserValidationSchema,
};