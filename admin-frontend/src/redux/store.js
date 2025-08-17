import {configureStore} from "@reduxjs/toolkit";
import {rootApi} from "../services/rootApi.js";

export const store = configureStore({
    reducer: {
        [rootApi.reducerPath]: rootApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(rootApi.middleware);
    }
});
