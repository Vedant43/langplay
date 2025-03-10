import { apiClient } from "./client"

const createPlaylist = async ( name ) => {
    const response = await apiClient.post( `/playlist/create-playlist`,  {name}  )
    return response.data.data
}

const fetchPlaylistByUser = async () => {
    const response = await apiClient.get("/playlist/playlist")
    return response.data.data
}
const isVideoInPlaylist = async (playlistId, videoId) => {
    console.log("playlist id:")
    console.log(playlistId)
    const response = await apiClient.post("/playlist/is-video-in-playlist", {playlistId, videoId})
    return response.data.data
}
const addVideoToPlaylist = async ( playlistId, videoId ) => {
    console.log(playlistId)
    const response = await apiClient.post(`playlist/save-video-to-playlist`, {playlistId, videoId})
    console.log(response)
    return response.data.data
}

export default { createPlaylist, fetchPlaylistByUser, addVideoToPlaylist, isVideoInPlaylist }