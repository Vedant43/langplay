import { Response } from "express";

class ApiError extends Error {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.details = details;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  handle(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    });
  }
}

export default ApiError;

// const error = new ApiError(400, "Invalid request");
// console.log(error instanceof ApiError); // ❌ Might return false wo setPrototypeOf
// console.log(error instanceof Error); // ✅ Returns true
// reserves the behavior of Error