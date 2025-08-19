import {configureStore} from "@reduxjs/toolkit";
import {rootApi} from "../services/rootApi.js";
import {authSlice} from "./slices/authSlice.js";
import {toastSlice} from "./slices/toastSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        toast: toastSlice.reducer,
        [rootApi.reducerPath]: rootApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(rootApi.middleware);
    }
});