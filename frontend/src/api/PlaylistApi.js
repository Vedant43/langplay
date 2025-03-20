import { apiClient } from "./client"

const createPlaylist = async ( name, type ) => {
    console.log("name-----------")
    console.log({name})
    const response = await apiClient.post( "/playlist/create-playlist",  {name, type}  )
    console.log("Response from api --------------", response)
    return response.data.data
}

const fetchPlaylistsByUser = async () => {
    const response = await apiClient.get("/playlist/playlist")
    console.log(response)
    return response.data.data
}

const isVideoInPlaylist = async ( playlistId, videoId ) => {
    const response = await apiClient.post("/playlist/is-video-in-playlist", {playlistId, videoId})
    return response.data.data
}

const addVideoToPlaylist = async ( playlistId, videoId ) => {
    const response = await apiClient.post("/playlist/save-video-to-playlist", {playlistId, videoId})
    return response.data.data
}

const fetchPlaylistById = async ( playlistId ) => {
    const response = await apiClient.get(`/playlist/playlist/${playlistId}`)
    return response.data.data
}

// router.delete("/:playlistId/video/:videoId", authenticate, asyncHandler(removeVideoFromPlaylist))
const removeVideoFromPlaylist = async ( playlistId, videoId) => {
    try {
        console.log("In Api")
        const response = await apiClient.post(`/playlist/save-video-to-playlist`, {playlistId, videoId},)
        console.log(response)
        return response.data.data
    } catch (error) {
        console.log("Error from API",error)
    }
}

export default { 
    createPlaylist, 
    fetchPlaylistsByUser, 
    addVideoToPlaylist, 
    isVideoInPlaylist, 
    fetchPlaylistById,
    removeVideoFromPlaylist
}