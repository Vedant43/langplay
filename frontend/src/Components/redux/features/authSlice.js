import { createSlice } from "@reduxjs/toolkit"

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authStatus: !!localStorage.getItem("accessToken"),
        profilePicture: null,
        channelName: '',
        username: '',
        id:''
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
            state.channelName = ""
            localStorage.removeItem("accessToken")
        },
    }
})

export const { setUser,logout } = authSlice.actions
export default authSlice.reducer

// createslice takes care of generating action type string, action creator functions, and action objects (earlier we had to define individually before toolkit came, it is needed after action is generated eg. {type: "auth/authStatus"})