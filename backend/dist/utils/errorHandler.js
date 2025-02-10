"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApiError_1 = __importDefault(require("./ApiError"));
// import { Request, Response, NextFunction } from "express"; does not work
// Explicitly type the error handler as ErrorRequestHandler
const errorHandler = (err, req, res, next) => {
    // ErrorRequestHandler ensures that function if for error
    if (!(err instanceof ApiError_1.default)) {
        console.log("HI from errorHandler");
        err = new ApiError_1.default(500, "Internal Server Error");
    }
    return err.handle(res);
};
exports.default = errorHandler;
