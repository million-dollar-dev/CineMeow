import {configureStore} from "@reduxjs/toolkit";
import {rootApi} from "../services/rootApi.js";
import {authSlice} from "./slices/authSlice.js";
import {snackbarSlice} from "./slices/snackbarSlice.js";

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        snackbar: snackbarSlice.reducer,
        [rootApi.reducerPath]: rootApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(rootApi.middleware);
    }
});
