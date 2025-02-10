"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.success = false;
        this.statusCode = statusCode;
        this.details = details;
        // Ensure the error name matches the class name for better debugging
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    handle(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            statusCode: this.statusCode,
            details: this.details,
        });
    }
}
exports.default = ApiError;
