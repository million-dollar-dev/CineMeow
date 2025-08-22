import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";

const ProtectedLayout = () => {
    const { accessToken } = useSelector((state) => state.auth);
    console.log(accessToken);
    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }

    return <Outlet />;
};

export default ProtectedLayout;