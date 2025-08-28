import React from 'react';
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

const ProtectedLayout = () => {
    const { accessToken } = useSelector((state) => state.auth);

    if (!accessToken) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Content */}
            <div className="flex flex-col flex-1 min-w-0">
                <Topbar />
                <main className="flex-1 bg-[#F1F4F9] px-4 overflow-y-auto overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;
