import { Response } from "express";

class ApiResponse {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: unknown;
  public readonly statusCode: number;

  constructor(
    statusCode: number,
    message: string = "Success",
    data: unknown = null,
  ) {
    this.success = statusCode < 400; // 
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  send(res: Response): Response {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      statusCode: this.statusCode,
    });
  }
}

export default ApiResponse;