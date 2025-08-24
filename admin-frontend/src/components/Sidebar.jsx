import React from "react";
import { Box, IconButton } from "@mui/material";
import {
    Dashboard,
    ShoppingCart,
    People,
    Settings,
    BarChart,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const menuItems = [
    { icon: <Dashboard />, path: "/dashboard" },
    { icon: <ShoppingCart />, path: "/orders" },
    { icon: <People />, path: "/customers" },
    { icon: <BarChart />, path: "/reports" },
    { icon: <Settings />, path: "/settings" },
];

const Sidebar = () => {
    return (
        <Box
            className="bg-white shadow-md flex flex-col items-center py-6"
            sx={{
                width: "80px",
                height: "100vh",
                borderRight: "1px solid #eee",
            }}
        >
            <div className="mb-8">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold">
                    🎬
                </div>
            </div>

            {/* Menu */}
            <div className="flex flex-col gap-6">
                {menuItems.map((item, idx) => (
                    <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center justify-center w-12 h-12 rounded-full transition ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-500 hover:bg-blue-100 hover:text-blue-600"
                            }`
                        }
                    >
                        <IconButton>{item.icon}</IconButton>
                    </NavLink>
                ))}
            </div>
        </Box>
    );
};

export default Sidebar;
