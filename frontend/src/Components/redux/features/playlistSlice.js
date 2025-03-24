import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PlaylistApi from "../../../api/PlaylistApi";

export const createPlaylist = createAsyncThunk(
    "playlists/createPlaylist",
    async ({ playlistName, type='USER_CREATED' }, { dispatch, rejectWithValue }) => {
        try {
            const response = await PlaylistApi.createPlaylist( playlistName, type )
            await dispatch(refreshPlaylists()).unwrap()
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.data?.message || "Failed to create playlist")
        }
    }
)

export const fetchPlaylists = createAsyncThunk(
    "playlists/fetchPlaylists",
    async ( _, { rejectWithValue } ) => {
        try {
            const response = await PlaylistApi.fetchPlaylistsByUser()
            console.log("--------------------------------------------------------------------")
            console.log(response)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.data?.message || "Failed to fetch playlists")
        }
    }
)

export const fetchPlaylistById = createAsyncThunk(
    "playlists/fetchPlaylistById",
    async ( playlistId, { rejectWithValue }) => {
        try {
            console.log(playlistId)
            const response = await PlaylistApi.fetchPlaylistById(playlistId)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch playlists")
        }
    }
)

export const addVideoToPlaylist = createAsyncThunk(
    "playlists/addVideoToPlaylist",
    async ( {playlistId, videoId}, { rejectWithValue }) => {
        try {
            console.log("playlistId", playlistId)
            console.log("videoId", videoId)
            const response = await PlaylistApi.addVideoToPlaylist(playlistId, videoId)
            console.log(response)
            await dispatch(refreshPlaylists()).unwrap()
            return { playlistId, videoId}
        } catch (error) {
            return rejectWithValue(error?.response?.data?.message || "Failed to add videoto playlist")
        }
    }
)

export const removeVideoFromPlaylist = createAsyncThunk(
    "playlists/removeVideoFromPlaylist",
    async ( {playlistId, videoId}, { rejectWithValue }) => {
        try {
            const response = await PlaylistApi.removeVideoFromPlaylist(playlistId, videoId)
            return { playlistId, videoId }
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response?.data?.message || "Failed to remove video");
        }
    }
)

export const fetchPlaylistsIfNeeded = createAsyncThunk(
    "playlists/fetchPlaylistsIfNeeded",
    async ( _ , { getState, dispatch }) => {
        const { playlist } = getState()
        console.log(playlist)
        if (playlist.status !== "loading" && !playlist.playlistsLoaded) {
            return dispatch(fetchPlaylists())
        }
    } 
)

export const refreshPlaylists = createAsyncThunk(
    "playlists/refreshPlaylists",
    async (_, { dispatch }) => {
        console.log("Before resetting playlist")
        dispatch(resetPlaylistsLoaded())
        console.log("After resetting playlist")
        const response = await dispatch(fetchPlaylists()).unwrap()
        console.log("Response after fetching playlists in refresh playlist")
        return response
        // leads to infinite loop or unexpected behaviour
        // return dispatch(fetchPlaylists())
    }
)

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState: {
        playlists: [],              // meta data of playlists
        selectedPlaylist: null,     // to open particular playlist
        playlistVideos: {},         // playlist videos
        status: "idle",
        error: null,
        checkedPlaylists: null,      // For checkbox, if playlist
        playlistsLoaded: false,
        addVideoStatus: "idle",
        removeVideoStatus: "idle",
        createPlaylistStatus: "idle"
    },
    reducers: {
        setSelectedPlaylist: (state, action) => {
            console.log(action.payload)
            state.selectedPlaylist = action.payload
        },
        resetPlaylistsLoaded: (state) => {
            state.playlistsLoaded = false
        }
    },
    extraReducers: (builder) => {
        builder
            // ----------------Fetch Playlists------------------------
            .addCase(fetchPlaylists.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.playlists = action.payload,
                state.playlistsLoaded = true,
                state.error = null
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.status = "failed",
                state.error = action.payload
            })

            // -----------------Fetch Playlists By Id-----------------
            .addCase(fetchPlaylistById.pending, (state) => {
                state.status = "loading",
                state.error = null
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.status = "succeeded",
                state.selectedPlaylist = action.payload
                state.error = null
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.status = "failed",
                state.error = action.payload
            })

            //------------------Create Playlists------------------------
            .addCase(createPlaylist.pending, (state) => {
                state.createPlaylistStatus = "loading"
                // state.error = null
            })
            .addCase(createPlaylist.fulfilled, (state, action) => {
                state.createPlaylistStatus = "succeeded"
            })
            .addCase(createPlaylist.rejected, (state, action) => {
                state.createPlaylistStatus = "failed",
                state.error = action.payload
            })

            //--------------------Add video to Playlist-------------------
            .addCase(addVideoToPlaylist.pending, (state) => {
                state.addVideoStatus = "loading",
                state.error = null
            })
            .addCase(addVideoToPlaylist.fulfilled, (state, action) => {
                state.addVideoStatus = "succeeded"
            })
            .addCase(addVideoToPlaylist.rejected, (state, action) => {
                state.addVideoStatus = "failed",
                state.error = action.payload
            })    

            // -----------------Remove Video from Playlist-----------------
            .addCase(removeVideoFromPlaylist.pending, (state) => {
                state.status = "loading",
                state.error = null
            })
            .addCase(removeVideoFromPlaylist.fulfilled, (state, action) => {                
                state.removeVideoStatus = "succeeded"
                state.error = null
            })
            .addCase(removeVideoFromPlaylist.rejected, (state, action) => {
                state.removeVideoStatus = "failed";
                state.error = action.payload;               
            })
    }
})

export const { setSelectedPlaylist, resetPlaylistsLoaded } = playlistsSlice.actions
export default playlistsSlice.reducer