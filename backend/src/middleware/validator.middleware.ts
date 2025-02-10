import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import ApiError from "../utils/ApiError"; // Assuming you have an ApiError class

export const validate = (schema: AnyZodObject) =>                                  
  (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body)
      schema.parse(
        req.body, // We can use schema.parse({body:req.body, params:,query:}) but we have not defined params in schema
      );
      next(); 
    } catch (error) {
      if (error instanceof ZodError) {
        return next(
          new ApiError(400, "Validation faild", error.errors)
        );
      }
      next(error);
    }
  };

// Outer function accepts zod schema, inner function validates schema (Currying function)
// next() calls next handler and if schema.parse throws error we can get zod error by error.errors

// Normal middlewares: 
//   const validateRequest = (req, res, next) => {
//     if (!req.body.username) {
//       return res.status(400).send("Username is required");
//     }
//     next(); 
//   };
  
//   app.post("/signup", validateRequest, (req, res) => {
//   });

// Passing validateRequest vs	Passing validateRequest(req, res, next)
// Passes the function itself as middleware vs Calls the function immediately and passes its return value.