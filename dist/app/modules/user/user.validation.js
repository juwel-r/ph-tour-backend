"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name at-least 2 character" })
        .max(20, { message: "Name can't exceed 20 character" }),
    email: zod_1.default.string().email({ message: "Email is not valid" }),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 character" })
        .regex(/[a-z]/, { message: "Must include a lowercase letter." })
        .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
        .regex(/\d/, { message: "Must include a digit." })
        .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
        message: "Must include a special character.",
    })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Please provide valid phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address can not exceed 200 character." })
        .optional(),
});
//==> Update ZOD Schema, make sure all field must be in optional, cause user or admin can update anyone field
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name at-least 2 character" })
        .max(20, { message: "Name can't exceed 20 character" })
        .optional(),
    // password: z
    //   .string()
    //   .min(8, { message: "Password must be at least 8 character" })
    //   .regex(/[a-z]/, { message: "Must include a lowercase letter." })
    //   .regex(/[A-Z]/, { message: "Must include an uppercase letter." })
    //   .regex(/\d/, { message: "Must include a digit." })
    //   .regex(/[!@#$%^&*()_+{}\\[\]:;"'<>,.?/~\\|-]/, {
    //     message: "Must include a special character.",
    //   })
    //   .optional(),
    //an api has created dedicated only for password change
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Please provide valid phone number",
    })
        .optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address can not exceed 200 character." })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isVerified: zod_1.default.boolean().optional(),
    isDelete: zod_1.default.boolean().optional(),
});
