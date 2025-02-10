import express from "express";
import { signUp, signIn } from "../controller/auth.controller";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validator.middleware";
import { signInSchema, signUpSchema } from "../validators/zod.schema";
import { upload } from "../middleware/multer.middleware";

const router = express.Router();

router.post("/signup", upload, validate(signUpSchema),  asyncHandler(signUp))
router.post("/signin", validate(signInSchema), asyncHandler(signIn))

export default router
