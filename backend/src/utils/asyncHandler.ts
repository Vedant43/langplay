import { Request, Response, NextFunction } from "express";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

// const asyncHandler =
//   (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     console.log("asyncHandler reached for:", req.method, req.url);
//     Promise.resolve(fn(req, res, next))
//       .then(() => console.log("Handler executed successfully"))
//       .catch((error) => {
//         console.error("Error in asyncHandler:", error);
//         next(error);
//       });
//   };


export default asyncHandler;

// We need to define signature again in inner function because TS can not take arguments from outer function
