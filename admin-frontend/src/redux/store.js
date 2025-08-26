import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {rootApi} from "../services/rootApi.js";
import {authSlice} from "./slices/authSlice.js";
import {snackbarSlice} from "./slices/snackbarSlice.js";
import storage from "redux-persist/lib/storage";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import {sidebarSlice} from "./slices/sidebarSlice.js";
import {logoutMiddleware} from "../middlewares/logoutMiddleware.js";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: [rootApi.reducerPath, sidebarSlice]
};

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        auth: authSlice.reducer,
        snackbar: snackbarSlice.reducer,
        sidebar: sidebarSlice.reducer,
        [rootApi.reducerPath]: rootApi.reducer,
    }),
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: {
                ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        }).concat(logoutMiddleware, rootApi.middleware);
    }
});

export const persistor = persistStore(store);
