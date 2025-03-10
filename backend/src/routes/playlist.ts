import { Router } from "express"
import { authenticate } from "../middleware/auth.middleware"
import asyncHandler from "../utils/asyncHandler"
import { createPlaylist, getPlaylistsByUserId, isVideoInPlaylist, getPlaylistById, removeVideoFromPlaylist, saveVideoToPlaylist } from "../controller/playlist.controller"
import { validate } from "../middleware/validator.middleware"
import { createPlaylistSchema } from "../validators/zod.schema"

const router = Router()

router.post("/create-playlist/", authenticate, validate(createPlaylistSchema) , asyncHandler(createPlaylist))

router.get("/playlist", authenticate, asyncHandler(getPlaylistsByUserId))

router.get("/playlist/:playlistId", authenticate, asyncHandler(getPlaylistById))

router.post("/is-video-in-playlist", authenticate, asyncHandler(isVideoInPlaylist))

router.post("/save-video-to-playlist", authenticate, asyncHandler(saveVideoToPlaylist))

router.delete("/delete-playlist")

router.delete("/:playlistId/video/:videoId", authenticate, asyncHandler(removeVideoFromPlaylist))

// fetch all playlist with video or make separate route
export default router

// send data via param in get request and via body in post request