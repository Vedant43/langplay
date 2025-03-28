import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        id:null,
        authStatus: !!localStorage.getItem("accessToken"),
        profilePicture: null,
        channelName: '',
        username: '',
        subscribers: null
    },
    reducers: {
        setUser: (state,action) => {
            state.authStatus = true
            state.profilePicture = action.payload.profilePicture,
            state.channelName = action.payload.channelName,
            state.username = action.payload.username,
            state.id = action.payload.id
        },
        logout: (state) => {
            state.authStatus = false
            state.profilePicture = null
            state.username = ''
            state.id = null
            state.channelName = ""
            localStorage.removeItem("accessToken")
        },
        setSubscribers: (state, action) => {
            state.subscribers = action.payload
        }
    }
})

export const { setUser,logout } = authSlice.actions
export default authSlice.reducer

// createslice takes care of generating action type string, action creator functions, and action objects (earlier we had to define individually before toolkit came, it is needed after action is generated eg. {type: "auth/authStatus"})