import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {openSnackbar} from "../redux/slices/snackbarSlice.js";

export default function useFormServerErrors(isError, error, setError) {
    const dispatch = useDispatch();
    useEffect(() => {
        if (isError && error?.data?.data) {
            Object.entries(error.data.data).forEach(([field, message]) => {
                setError(field, { type: "server", message });
            });
            const messages = Object.values(error.data.data).join(", ");
            dispatch(openSnackbar({ message: messages, type: "error" }));
        }
    }, [isError, error, setError]);
}
