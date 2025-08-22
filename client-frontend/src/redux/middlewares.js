import {clearTokens} from "./slices/authSlice.js";
import {persistor} from "./store.js";

export const logoutMiddleware = () => {
    return (next) => {
        return (action) => {
            if (action.type === clearTokens.type) {
                void persistor.purge();
            }
            return next(action);
        }
    }
}