import { apiClient } from "./client"

const fetchAllVideos = async () => {
    const response = await apiClient.get("/video/")
    return response.data.data
}

const fetchAllVideosByUser = async () => {
    const response = await apiClient.get("/video/:userId/videos")
    return response.data.data
}

const fetchVideo = async ( videoId ) => {
    const response = await apiClient.get(`/video/${videoId}`)
    return response.data.data
}

const increaseViewCount = async ( videoId ) => {
    const response = await apiClient.post(`/video/${videoId}/view`)
    return response.data.data
}

const postComment = async ( videoId, {content} ) => {
    const response = await apiClient.post(`/video/${videoId}/comment`, {content})
    return response.data.data
}

const likeVideo = async ( videoId ) => {
    const response = await apiClient.post(`/video/${videoId}/like`)
    return response.data.data
}

const dislikeVideo = async ( videoId ) => {
    const response = await apiClient.post(`/video/${videoId}/dislike`)
    return response.data.data
}

const uploadVideo = async ( data ) => {
    const response = await apiClient.post("/video/upload", data)
    return response.data.message
}

// router.delete("/:id", authenticate, asyncHandler(deleteVideoById))
const deleteVideo = async (videoId) => {
    const response = await apiClient.delete(`/video/${videoId}`)
    console.log(response)
    return response.data.message
}

export default {
    fetchVideo,
    postComment,
    likeVideo,
    dislikeVideo,
    fetchAllVideos,
    increaseViewCount,
    fetchAllVideosByUser,
    uploadVideo,
    deleteVideo
}