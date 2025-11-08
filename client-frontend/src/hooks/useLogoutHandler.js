import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../services/authService.js";
import {clearTokens} from "../redux/slices/authSlice.js";
import {clearUser} from "../redux/slices/userSlice.js";
import {rootApi} from "../services/rootApi.js";
import {toast} from "react-toastify";

export const useLogoutHandler = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const accessToken = useSelector((state) => state.auth.accessToken);

    const [logout, { isLoading, isError, error }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            if (accessToken) {
                await logout(accessToken).unwrap();
            }
        } catch (err) {
            toast.error("Logout failed:", err);
        } finally {
            dispatch(clearTokens());
            dispatch(clearUser());
            dispatch(rootApi.util.resetApiState());
            navigate("/");
        }
    };

    return {
        handleLogout,
        isLoggingOut: isLoading,
        logoutError: isError ? error : null,
    };
};