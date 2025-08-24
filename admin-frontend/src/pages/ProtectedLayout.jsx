import React from 'react';
import {useSelector} from "react-redux";
import {Navigate, Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const ProtectedLayout = () => {
    const { accessToken } = useSelector((state) => state.auth);
    console.log(accessToken);
    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <Topbar />
                <main className="p-4 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;