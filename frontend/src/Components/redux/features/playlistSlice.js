import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PlaylistApi from "../../../api/PlaylistApi";

export const fetchPlaylists = createAsyncThunk(
    "playlists/fetchPlaylists",
    async (_, { rejectWithValue }) => {
        try {
            console.log("object")
            const response = await PlaylistApi.fetchPlaylistsByUser()
            console.log(response)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch playlists")
        }
    }
)

export const fetchPlaylistById = createAsyncThunk(
    "playlists/fetchPlaylistById",
    async ( playlistId, { rejectWithValue }) => {
        try {
            const response = await PlaylistApi.fetchPlaylistById(playlistId)
            return response
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch playlists")
        }
    }
)

export const playlistsSlice = createSlice({
    name: "playlists",
    initialState: {
        playlists: [],
        selectedPlaylist: null,
        status: "idle",
        error: null,
    },
    reducers: {
        setSelectedPlaylist: (state, action) => {
            console.log(action.payload)
            state.selectedPlaylist = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPlaylists.pending, (state) => {
                state.status = "loading"
                state.error = null
            })
            .addCase(fetchPlaylists.fulfilled, (state, action) => {
                state.status = "succeeded"
                state.playlists = action.payload
            })
            .addCase(fetchPlaylists.rejected, (state, action) => {
                state.status = "failed"
            })
            .addCase(fetchPlaylistById.pending, (state) => {
                state.error = "loading",
                state.error = null
            })
            .addCase(fetchPlaylistById.fulfilled, (state, action) => {
                state.status = "succeeded",
                console.log("Fetched Playlist:", action.payload);
                state.selectedPlaylist = action.payload
            })
            .addCase(fetchPlaylistById.rejected, (state, action) => {
                state.status = "failed",
                state.error = action.payload
            })
    }
})

export const { setSelectedPlaylist } = playlistsSlice.actions
export default playlistsSlice.reducer