import {clearTokens} from "../redux/slices/authSlice.js";
import {persistor} from "../redux/store.js";

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