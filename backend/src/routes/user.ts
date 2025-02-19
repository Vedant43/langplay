import express from "express";
import { signUp, signIn, setupProfile, getuserById } from "../controller/auth.controller";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validator.middleware";
import { setupProfileSchema, signInSchema, signUpSchema } from "../validators/zod.schema";
import { uploadProfileCover } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/signup", uploadProfileCover, validate(signUpSchema),  asyncHandler(signUp))

router.post("/setup-profile", authenticate, uploadProfileCover, validate(setupProfileSchema), asyncHandler(setupProfile))

router.post("/signin", validate(signInSchema), asyncHandler(signIn))

router.get("/user", authenticate, asyncHandler(getuserById))

// we can create a video tag by cloudinary.video("public_id")
// cloudinary.url("public_id", {type:"fetch"}) => for auto updation of image we are using remote source
export default router
