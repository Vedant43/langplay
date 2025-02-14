import express from "express";
import { signUp, signIn } from "../controller/auth.controller";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validator.middleware";
import { signInSchema, signUpSchema } from "../validators/zod.schema";
import { uploadProfileCover } from "../middleware/multer.middleware";

const router = express.Router();

router.post("/signup", uploadProfileCover, validate(signUpSchema),  asyncHandler(signUp))
router.post("/signin", validate(signInSchema), asyncHandler(signIn))

// we can create a video tag by cloudinary.video("public_id")
// cloudinary.url("public_id", {type:"fetch"}) => for auto updation of image we are using remote source
export default router
