import { apiClient } from "./client"

const fetchAllVideos = async () => {
    const response = await apiClient.get("/video/")
    return response.data.data
}

const fetchVideo = async ( videoId ) => {
    const response = await apiClient.get(`/video/${videoId}`)
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

export default { 
    fetchVideo, 
    postComment, 
    likeVideo, 
    dislikeVideo, 
    fetchAllVideos
} 