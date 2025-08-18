import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
    name: "toast",
    initialState: {
        open: false,
        message: "",
        type: "info", // "success" | "error" | "warning" | "info"
    },
    reducers: {
        showToast: (state, action) => {
            state.open = true;
            state.message = action.payload.message;
            state.type = action.payload.type || "info";
        },
        hideToast: (state) => {
            state.open = false;
            state.message = "";
            state.type = "info";
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
