import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    refreshToken: null,
    accessToken: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },

        clearTokens: () => {
            return initialState;
        }
    }
})

export const {setTokens, clearTokens} = authSlice.actions;
export default authSlice.reducer;