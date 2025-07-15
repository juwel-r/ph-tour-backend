import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" }),
  email: z.string().email({ message: "Email is not valid" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
    .regex(/\d/, { message: "Must include a digit." })
    .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
      message: "Must include a special character.",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Please provide valid phone number",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address can not exceed 200 character." })
    .optional(),
});

//==> Update ZOD Schema, make sure all field must be in optional, cause user or admin can update anyone field
export const updateUserZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name at-least 2 character" })
    .max(20, { message: "Name can't exceed 20 character" })
    .optional(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/[a-z]/, { message: "Must include a lowercase letter." })
    .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
    .regex(/\d/, { message: "Must include a digit." })
    .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
      message: "Must include a special character.",
    })
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Please provide valid phone number",
    })
    .optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address can not exceed 200 character." })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z.boolean().optional(),
  isDelete: z.boolean().optional(),
});
