"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const client_1 = require("@prisma/client");
const ApiResponse_1 = __importDefault(require("../utils/ApiResponse"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, channelName, email, password, profilePicture, coverPicture, description } = req.body;
        const existingUser = yield prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username },
                    { channelName },
                ],
            },
        });
        if (existingUser) {
            throw new ApiError_1.default(400, "Email, username, or channel name already exists.");
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma.user.create({
            data: {
                username,
                channelName,
                email,
                password: hashedPassword,
                profilePicture: profilePicture !== null && profilePicture !== void 0 ? profilePicture : null,
                coverPicture: coverPicture !== null && coverPicture !== void 0 ? coverPicture : null,
                description: description !== null && description !== void 0 ? description : null,
            },
        });
        return new ApiResponse_1.default(201, "User signed up successfully", newUser).send(res);
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            return error.handle(res);
        }
        return new ApiError_1.default(500, "Internal Server Error", error).handle(res);
    }
});
exports.signUp = signUp;
// If existingUser is found, the ApiError will be thrown => .catch(next) from asyncHandler => Global error Handler(For customised error)
// try-catch Block:
// Handles known errors and provides specific responses.
// Adds context or wraps unexpected errors in a consistent format.
// asyncHandler:
// Catches unhandled errors and forwards them to Express’s global error handler.
// Why Both?
// The try-catch block gives you fine-grained control over error handling.
// The asyncHandler ensures that no errors slip through and reach the global error handler.
