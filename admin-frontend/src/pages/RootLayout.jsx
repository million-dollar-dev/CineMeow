import React, {Suspense} from 'react';
import  {Outlet} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {Alert, Snackbar} from "@mui/material";
import {closeSnackbar} from "../redux/slices/snackbarSlice.js";
const RootLayout = () => {
    const {open, type, message} = useSelector((state) => {
        return state.snackbar;
    });
    const dispatch = useDispatch();
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <Outlet />
                <Snackbar open={open} autoHideDuration={6000} onClose={() => {dispatch(closeSnackbar())}}>
                    <Alert
                        severity={type}
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        {message}
                    </Alert>
                </Snackbar>
            </Suspense>
        </div>
    );
};

export default RootLayout;