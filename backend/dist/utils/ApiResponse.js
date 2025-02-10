"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Standardized API response format for success cases.
 */
class ApiResponse {
    constructor(statusCode, message = "Success", data = null) {
        this.success = statusCode < 400; // 2xx/3xx status codes are considered successful
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
    /**
     * Send the formatted response to the client.
     */
    send(res) {
        return res.status(this.statusCode).json({
            success: this.success,
            message: this.message,
            data: this.data,
            statusCode: this.statusCode,
        });
    }
}
exports.default = ApiResponse;
