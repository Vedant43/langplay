import { Response } from "express";

class ApiError extends Error {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly details?: unknown; // For validation erroes

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.success = false;
    this.statusCode = statusCode;
    this.details = details;

    // Ensure the error name matches the class name for better debugging
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
