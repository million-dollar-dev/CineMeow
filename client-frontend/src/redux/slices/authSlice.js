import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    refreshToken: null,
    accessToken: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        }
    }
})

export const {login} = authSlice.actions;
export default authSlice.reducer;