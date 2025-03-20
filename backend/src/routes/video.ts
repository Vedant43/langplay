import { Router } from "express"
import { uploadVideoWithThumbnail } from "../middleware/multer.middleware"
import { validate } from "../middleware/validator.middleware"
import { commentSchema, videoUploadSchema } from "../validators/zod.schema"
import asyncHandler from "../utils/asyncHandler"
import { deleteVideoById, getAllVideos, getVideoById, getVideosByUser, uploadVideo, addComment, deleteCommentById, likeVideo, dislikeVideo, getLikedVideos, increaseViewCount } from "../controller/video.controller"
import { authenticate } from "../middleware/auth.middleware"

const router = Router()

router.post("/upload", authenticate, uploadVideoWithThumbnail, validate(videoUploadSchema), asyncHandler(uploadVideo))

router.delete("/:id", authenticate, asyncHandler(deleteVideoById))

router.get("/:userId/videos", asyncHandler(getVideosByUser)) // 

router.get("/", asyncHandler(getAllVideos))

router.get("/liked-videos", authenticate, asyncHandler(getLikedVideos))

router.get("/:id", asyncHandler(getVideoById)) //

router.post("/:id/view", asyncHandler(increaseViewCount)) //

router.post("/:id/like", authenticate, asyncHandler(likeVideo))

router.post("/:id/dislike", authenticate, asyncHandler(dislikeVideo))

router.post("/:videoId/comment", authenticate, validate(commentSchema), asyncHandler(addComment))

// router.get("/:videoId/comments", authenticate ,asyncHandler(getComments)) // not needed as comment will be fetched in getVideoById

router.delete("/:userId/comment/:commentId", authenticate, asyncHandler(deleteCommentById))
// need to update, should be video id and commentid

export default router

// The as assertion forces TypeScript to accept it, while direct type annotation (:) requires TypeScript to infer the type properly.

// update video details
// subscribe to channel
// add notification on video upload
