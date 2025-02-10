import { ErrorRequestHandler } from "express";
import ApiError from "./ApiError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

  if (err instanceof PrismaClientKnownRequestError) {
    console.log("Prisma Error:", err) 
    err = new ApiError(400, "A database error occurred", err.message)
  } 

  else if(!(err instanceof ApiError)) {
    console.log("Unknown Error:", err)
    err = new ApiError(500, "Internal Server Error", err.message)
  }

  return err.handle(res)
}

export default errorHandler;

// import { Request, Response, NextFunction } from "express"; does not work
// Explicitly type the error handler as ErrorRequestHandler