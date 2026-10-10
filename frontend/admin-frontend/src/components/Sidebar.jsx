import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip, IconButton } from "@mui/material";

// Redux
import { toggle } from "../redux/slices/sidebarSlice.js";
import { useLogout } from "../hooks/useLogout.js";

// Material UI Icons
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CameraOutdoorOutlinedIcon from "@mui/icons-material/CameraOutdoorOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

const menuGroups = [
    {
        title: "Tổng quan",
        items: [
            {
                label: "Bảng điều khiển",
                path: "/dashboard",
                Icon: DashboardOutlinedIcon,
            },
        ],
    },
    {
        title: "Vận hành điện ảnh",
        items: [
            {
                label: "Kho phim",
                path: "/movies",
                Icon: MovieOutlinedIcon,
            },
            {
                label: "Suất chiếu",
                path: "/showtimes",
                Icon: CalendarMonthOutlinedIcon,
            },
            {
                label: "Cụm rạp & Phòng",
                path: "/cinemas",
                Icon: CameraOutdoorOutlinedIcon,
            },
            {
                label: "Thương hiệu rạp",
                path: "/brands",
                Icon: StorefrontOutlinedIcon,
            },
        ],
    },
    {
        title: "Bán vé & Dịch vụ",
        items: [
            {
                label: "Đơn đặt vé",
                path: "/bookings",
                Icon: ReceiptLongOutlinedIcon,
            },
            {
                label: "Bảng giá vé",
                path: "/pricing",
                Icon: ConfirmationNumberOutlinedIcon,
            },
            {
                label: "Bắp nước FnB",
                path: "/fnb",
                Icon: FastfoodOutlinedIcon,
            },
            {
                label: "Ưu đãi & Khuyến mãi",
                path: "/promotion",
                Icon: LoyaltyOutlinedIcon,
            },
        ],
    },
    {
        title: "Hệ thống",
        items: [
            {
                label: "Tài khoản quản trị",
                path: "/accounts",
                Icon: ManageAccountsOutlinedIcon,
            },
            {
                label: "Thông báo hệ thống",
                path: "/notifications",
                Icon: NotificationsNoneOutlinedIcon,
            },
            {
                label: "Cấu hình hệ thống",
                path: "/settings",
                Icon: SettingsOutlinedIcon,
            },
        ],
    },
];

// Tooltip style token for collapsed icons
const tooltipSlotProps = {
    tooltip: {
        sx: {
            bgcolor: "#0F172A",
            color: "#F8FAFC",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "10px",
            px: 2,
            py: 1,
            boxShadow: "0 14px 32px -4px rgba(15, 23, 42, 0.4)",
            "& .MuiTooltip-arrow": {
                color: "#0F172A",
            },
        },
    },
};

const Sidebar = () => {
    const dispatch = useDispatch();
    const expanded = useSelector((state) => state.sidebar.expanded);
    const { logOut } = useLogout();

    return (
        <aside
            className={`h-screen sticky top-0 shrink-0 bg-white border-r border-slate-200/80 shadow-[1px_0_12px_rgba(15,23,42,0.03)] flex flex-col transition-all duration-300 z-30 select-none ${
                expanded ? "w-64" : "w-24"
            }`}
        >
            {/* 1. TOP HEADER: LOGO & COLLAPSE TOGGLE */}
            <div
                className={`h-20 shrink-0 flex items-center border-b border-slate-100/80 ${
                    expanded ? "px-4 justify-between" : "justify-center"
                }`}
            >
                {expanded ? (
                    <>
                        <NavLink to="/dashboard" className="flex items-center gap-3 min-w-0 group">
                            {/* Logo Icon */}
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 p-2 shrink-0 group-hover:scale-105 transition-transform">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 640 640"
                                    className="w-full h-full fill-current"
                                >
                                    <path d="M96 160C149 160 192 203 192 256L192 341.8C221.7 297.1 269.8 265.6 325.4 257.8C351 317.8 410.6 359.9 480 359.9C490.9 359.9 501.6 358.8 512 356.8L512 544C512 561.7 497.7 576 480 576C462.3 576 448 561.7 448 544L448 403.2L312 512L368 512C385.7 512 400 526.3 400 544C400 561.7 385.7 576 368 576L224 576C171 576 128 533 128 480L128 256C128 239.4 115.4 225.8 99.3 224.2L92.7 223.9C76.6 222.2 64 208.6 64 192C64 174.3 78.3 160 96 160zM565.8 67.2C576.2 58.5 592 65.9 592 79.5L592 192C592 253.9 541.9 304 480 304C418.1 304 368 253.9 368 192L368 79.5C368 65.9 383.8 58.5 394.2 67.2L448 112L512 112L565.8 67.2zM432 172C421 172 412 181 412 192C412 203 421 212 432 212C443 212 452 203 452 192C452 181 443 172 432 172zM528 172C517 172 508 181 508 192C508 203 517 212 528 212C539 212 548 203 548 192C548 181 539 172 528 172z" />
                                </svg>
                            </div>

                            {/* Brand Name & Tag */}
                            <div className="flex items-center gap-1.5 truncate">
                                <span className="font-extrabold text-base text-slate-900 tracking-tight">
                                    Cine<span className="text-violet-600">Meow</span>
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-violet-100/80 text-violet-700 uppercase tracking-wide">
                                    Admin
                                </span>
                            </div>
                        </NavLink>

                        {/* Collapse Toggle Button */}
                        <Tooltip title="Thu gọn menu" placement="bottom" arrow disableInteractive slotProps={tooltipSlotProps}>
                            <IconButton
                                size="small"
                                onClick={() => dispatch(toggle())}
                                className="!text-slate-400 hover:!text-slate-700 hover:!bg-slate-100 !rounded-lg"
                            >
                                <MenuOpenOutlinedIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                        </Tooltip>
                    </>
                ) : (
                    /* Centered Logo in Collapsed Mode (Ultra 64x64 Target) */
                    <Tooltip title="Mở rộng menu (CineMeow Admin)" placement="right" arrow disableInteractive slotProps={tooltipSlotProps}>
                        <button
                            type="button"
                            onClick={() => dispatch(toggle())}
                            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-violet-500/25 p-4 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 640"
                                className="w-8 h-8 fill-current"
                            >
                                <path d="M96 160C149 160 192 203 192 256L192 341.8C221.7 297.1 269.8 265.6 325.4 257.8C351 317.8 410.6 359.9 480 359.9C490.9 359.9 501.6 358.8 512 356.8L512 544C512 561.7 497.7 576 480 576C462.3 576 448 561.7 448 544L448 403.2L312 512L368 512C385.7 512 400 526.3 400 544C400 561.7 385.7 576 368 576L224 576C171 576 128 533 128 480L128 256C128 239.4 115.4 225.8 99.3 224.2L92.7 223.9C76.6 222.2 64 208.6 64 192C64 174.3 78.3 160 96 160zM565.8 67.2C576.2 58.5 592 65.9 592 79.5L592 192C592 253.9 541.9 304 480 304C418.1 304 368 253.9 368 192L368 79.5C368 65.9 383.8 58.5 394.2 67.2L448 112L512 112L565.8 67.2zM432 172C421 172 412 181 412 192C412 203 421 212 432 212C443 212 452 203 452 192C452 181 443 172 432 172zM528 172C517 172 508 181 508 192C508 203 517 212 528 212C539 212 548 203 548 192C548 181 539 172 528 172z" />
                            </svg>
                        </button>
                    </Tooltip>
                )}
            </div>

            {/* 2. NAVIGATION MENU LIST */}
            <nav
                className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-5 ${
                    expanded ? "px-3 space-y-5" : "w-full flex flex-col items-center space-y-4"
                }`}
            >
                {menuGroups.map((group, gIdx) => (
                    <div key={gIdx} className={expanded ? "space-y-1" : "w-full flex flex-col items-center space-y-3"}>
                        {/* Section Header or Subtle Divider */}
                        {expanded ? (
                            <div className="px-3 mb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                {group.title}
                            </div>
                        ) : (
                            gIdx > 0 && <div className="w-8 h-px bg-slate-200/60 my-1.5" />
                        )}

                        {/* Navigation Items */}
                        {group.items.map((item, iIdx) => {
                            const { Icon } = item;
                            return (
                                <React.Fragment key={iIdx}>
                                    {expanded ? (
                                        /* Expanded Mode Item */
                                        <NavLink
                                            to={item.path}
                                            end
                                            className={({ isActive }) =>
                                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                                                    isActive
                                                        ? "bg-violet-50 text-violet-700 shadow-xs"
                                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    {/* Jewel Icon Box */}
                                                    <span
                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                                            isActive
                                                                ? "bg-violet-600 text-white shadow-xs shadow-violet-500/20"
                                                                : "text-slate-400 group-hover:text-slate-700"
                                                        }`}
                                                    >
                                                        <Icon sx={{ fontSize: 20 }} />
                                                    </span>

                                                    <span className="truncate">{item.label}</span>

                                                    {/* Elegant Active Pip */}
                                                    {isActive && (
                                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-600 shadow-xs shadow-violet-500/50" />
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    ) : (
                                        /* Collapsed Mode Item: Ultra 64x64 button with 32px icon, generous spacing */
                                        <Tooltip
                                            title={item.label}
                                            placement="right"
                                            arrow
                                            disableInteractive
                                            slotProps={tooltipSlotProps}
                                        >
                                            <NavLink
                                                to={item.path}
                                                end
                                                className={({ isActive }) =>
                                                    `w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                                                        isActive
                                                            ? "bg-violet-600 text-white shadow-xl shadow-violet-500/35 ring-2 ring-violet-400/25 scale-[1.02]"
                                                            : "text-slate-400 hover:text-violet-600 hover:bg-violet-50/80 hover:scale-105 active:scale-95"
                                                    }`
                                                }
                                            >
                                                <Icon sx={{ fontSize: 32 }} />
                                            </NavLink>
                                        </Tooltip>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* 3. BOTTOM: USER PROFILE & LOGOUT */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 shrink-0">
                {expanded ? (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                            {/* Avatar with Live Indicator */}
                            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                                AD
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate">Quản trị viên</p>
                                <p className="text-[10px] text-slate-400 truncate">Admin Portal</p>
                            </div>
                        </div>

                        {/* Quick Logout Button */}
                        <Tooltip title="Đăng xuất" placement="top" arrow disableInteractive slotProps={tooltipSlotProps}>
                            <IconButton
                                size="small"
                                onClick={logOut}
                                className="!text-slate-400 hover:!text-rose-600 hover:!bg-rose-50 !rounded-lg"
                            >
                                <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                ) : (
                    /* Centered Footer in Collapsed Mode: Ultra 64x64 Buttons */
                    <div className="flex flex-col items-center gap-3">
                        <Tooltip title="Quản trị viên (Đang trực tuyến)" placement="right" arrow disableInteractive slotProps={tooltipSlotProps}>
                            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all">
                                AD
                                <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </div>
                        </Tooltip>

                        <Tooltip title="Đăng xuất" placement="right" arrow disableInteractive slotProps={tooltipSlotProps}>
                            <IconButton
                                onClick={logOut}
                                className="!text-slate-400 hover:!text-rose-600 hover:!bg-rose-50 !rounded-2xl !w-16 !h-16 hover:scale-105 active:scale-95 transition-all"
                            >
                                <LogoutOutlinedIcon sx={{ fontSize: 28 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
