import { z } from "zod";
import { AddressType } from "./user.interface.js";

export const createAddressValidationSchema = z.object({
  body: z.object({
    type: z.nativeEnum(AddressType, {
      error: "Address type is required",
    }),

    fullName: z
      .string({
        error: "Full name is required",
      })
      .trim()
      .min(2, "Full name must be at least 2 characters")
      .max(50, "Full name cannot exceed 50 characters"),

    phone: z
      .string({
        error: "Phone number is required",
      })
      .trim()
      .regex(
        /^(?:\+8801|01)[3-9]\d{8}$/,
        "Please enter a valid Bangladeshi phone number"
      ),

    country: z
      .string({
        error: "Country is required",
      })
      .trim()
      .min(2),

    state: z
      .string({
        error: "State/Division is required",
      })
      .trim()
      .min(2),

    city: z
      .string({
        error: "City/District is required",
      })
      .trim()
      .min(2),

    area: z
      .string({
        error: "Area/Upazila is required",
      })
      .trim()
      .min(2),

    street: z
      .string({
        error: "Street address is required",
      })
      .trim()
      .min(5)
      .max(200),

    postalCode: z
      .string({
        error: "Postal code is required",
      })
      .trim()
      .min(3)
      .max(10),

    landmark: z
      .string()
      .trim()
      .max(100)
      .optional(),

    isDefault: z.boolean().optional().default(false),
  }),
});

export const updateAddressValidationSchema = z.object({
  body: createAddressValidationSchema.shape.body.partial(),
});

export const AddressValidation = {
  createAddressValidationSchema,
  updateAddressValidationSchema,
};