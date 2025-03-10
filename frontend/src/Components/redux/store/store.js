import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"
import playlistReducer from "../features/playlistSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        playlist: playlistReducer
    },
    },    
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

// reducer is like redux object for app and each feature is defined as slice as slice of redux objects means states.auth is state here and authReducer will decide how to update state.auth section/state when action is dispatched
