import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    expanded: true
}

export const sidebarSlice = createSlice({
    name: "sidebar",
    initialState,
    reducers: {
        open: (state) => {
            state.expanded = true;
        },
        close: (state) => {
            state.expanded = false;
        },
        toggle: (state) => {
            state.expanded = !state.expanded;
        }
    }
});


export const {open, close, toggle} = sidebarSlice.actions;
export default sidebarSlice.reducer;