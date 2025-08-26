import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {clearTokens} from "../redux/slices/authSlice.js";

export const useLogout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logOut = () => {
        dispatch(clearTokens());
        navigate("/login", {replace: true});
    }

    return {logOut};
}