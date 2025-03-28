import express from "express";
import { signUp, signIn, setupProfile, getuserById, getProfilePicAndChannelNameStatus, fetchSubscriptions, countSubscribers } from "../controller/auth.controller";
import asyncHandler from "../utils/asyncHandler";
import { validate } from "../middleware/validator.middleware";
import { setupProfileSchema, signInSchema, signUpSchema } from "../validators/zod.schema";
import { uploadProfileCover } from "../middleware/multer.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { subscribeToChannel } from "../controller/auth.controller";

const router = express.Router();

router.post("/signup", uploadProfileCover, validate(signUpSchema),  asyncHandler(signUp))

router.post("/update-profile", authenticate, uploadProfileCover, validate(setupProfileSchema), asyncHandler(setupProfile))

router.post("/signin",validate(signInSchema), asyncHandler(signIn))

router.get("/profile-info", authenticate, asyncHandler(getProfilePicAndChannelNameStatus))

router.get("/profile/:userId", authenticate, asyncHandler(getuserById))

router.get("/:userId", asyncHandler(fetchSubscriptions))

router.get("/subscribers/count", authenticate, asyncHandler(countSubscribers))

router.post("/subscribe", authenticate, asyncHandler(subscribeToChannel))

// we can create a video tag by cloudinary.video("public_id")
// cloudinary.url("public_id", {type:"fetch"}) => for auto updation of image we are using remote source
export default router
