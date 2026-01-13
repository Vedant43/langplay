import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: null,
    authStatus: !!localStorage.getItem("accessToken"),
    profilePicture: null, // ✅
    coverPicture: null,
    description: '',
    channelName: '',
    username: '',
    subscribers: null
  },

  reducers: {
    setUser: (state, action) => {
      state.authStatus = true;
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.channelName = action.payload.channelName;
      state.profilePicture = action.payload.profilePicture || null;
      state.coverPicture = action.payload.coverPicture || null;
      state.description = action.payload.description || '';
      state.subscribers = action.payload.subscribers || [];
    },

    logout: (state) => {
      state.authStatus = false;
      state.id = null;
      state.username = '';
      state.channelName = '';
      state.profilePicture = null;
      state.coverPicture = null;
      state.description = '';
      state.subscribers = null;
      localStorage.removeItem("accessToken");
    },

    setSubscribers: (state, action) => {
      state.subscribers = action.payload;
    }
  }
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
