"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
//     optional: z.string().optional(), // field not provided, or explicitly `undefined`
//     nullable: z.string().nullable(), // field explicitly `null`
//     nullish: z.string().nullish(), // field not provided, explicitly `null`, or explicitly `undefined`
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(5, "Username must be at least 5 characters long").max(30, "Username cannot exceed 30 characters"),
    channelName: zod_1.z.string().min(3, "Channel name must be at least 3 characters long").max(50, "Channel name cannot exceed 50 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long").max(100, "Password cannot exceed 100 characters"),
    profilePicture: zod_1.z.string().url("Invalid URL format").optional(),
    coverPicture: zod_1.z.string().url("Invalid URL format").optional(),
    description: zod_1.z.string().max(500, "Description cannot exceed 500 characters").optional(),
});
