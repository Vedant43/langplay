import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/authSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer
    }
})

// reducer is like redux object for app and each feature is defined as slice as slice of redux objects means states.auth is state here and authReducer will decide how to update state.auth section/state when action is dispatched
