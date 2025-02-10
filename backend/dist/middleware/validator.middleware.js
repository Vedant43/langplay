"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const ApiError_1 = __importDefault(require("../utils/ApiError")); // Assuming you have an ApiError class
const inspector_1 = require("inspector");
const validate = (schema) => (req, res, next) => {
    inspector_1.console.log("Request Body:", req.body);
    process.stdout.write("Hello"); // Force flush logs
    try {
        inspector_1.console.log(req.body);
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return next(new ApiError_1.default(400, "Validation faild", error.errors));
        }
        next(error);
    }
};
exports.validate = validate;
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
