import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    userId: null,
    username: null,
    phoneNumber: null,
    email: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId ?? state.userId;
            state.username = action.payload.username ?? state.username;
            state.phoneNumber = action.payload.phoneNumber ?? state.phoneNumber;
            state.email = action.payload.email ?? state.email;
        },

        clearUser: () => {
            return initialState;
        }
    }
})

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;