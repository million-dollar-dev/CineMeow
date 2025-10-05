import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {authSlice} from "./slices/authSlice.js";
import {toastSlice} from "./slices/toastSlice.js";
import {persistReducer, persistStore} from "redux-persist";
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import storage from "redux-persist/lib/storage";
import {logoutMiddleware} from "./middlewares.js";
import {rootApi} from "../services/rootApi.js";

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    blacklist: [rootApi.reducerPath],
}

const persistedReducer = persistReducer(
    persistConfig,
    combineReducers({
        auth: authSlice.reducer,
        toast: toastSlice.reducer,
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