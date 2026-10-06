import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    Tooltip,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    IconButton,
} from "@mui/material";

// Redux & Hooks
import { toggle } from "../redux/slices/sidebarSlice.js";
import { useLogout } from "../hooks/useLogout.js";

// Material UI Icons
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

// Dynamic Page Titles & Subtitles based on Route
const pageMeta = {
    "/": { title: "Trang chủ", subtitle: "Cổng thông tin quản trị CineMeow" },
    "/dashboard": { title: "Bảng điều khiển", subtitle: "Tổng quan hoạt động & doanh thu rạp chiếu" },
    "/movies": { title: "Kho phim", subtitle: "Quản lý danh mục & tình trạng phim chiếu" },
    "/showtimes": { title: "Suất chiếu", subtitle: "Lịch chiếu phim & khung giờ phòng máy" },
    "/cinemas": { title: "Cụm rạp & Phòng máy", subtitle: "Quản lý chi nhánh & cơ sở vật chất" },
    "/brands": { title: "Thương hiệu rạp", subtitle: "Chuỗi đối tác thương hiệu liên kết" },
    "/pricing": { title: "Bảng giá vé", subtitle: "Cấu hình định mức giá vé & phụ thu" },
    "/fnb": { title: "Bắp nước FnB", subtitle: "Danh mục combo ẩm thực & đồ uống" },
    "/promotion": { title: "Ưu đãi & Khuyến mãi", subtitle: "Chương trình ưu đãi & mã giảm giá" },
};

const notificationsData = [
    {
        id: 1,
        title: "Đơn đặt vé mới #CM-8921",
        desc: "Khách hàng đặt 2 vé Avatar 3 tại CineMeow Landmark",
        time: "2 phút trước",
        unread: true,
        icon: <ConfirmationNumberOutlinedIcon sx={{ fontSize: 18, color: "#6366F1" }} />,
        iconBg: "bg-violet-50",
    },
    {
        id: 2,
        title: "Suất chiếu sắp bắt đầu",
        desc: "Phòng 04 - CineMeow Thảo Điền (15 phút nữa)",
        time: "10 phút trước",
        unread: true,
        icon: <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: "#F59E0B" }} />,
        iconBg: "bg-amber-50",
    },
    {
        id: 3,
        title: "Báo cáo doanh thu đã sẵn sàng",
        desc: "Doanh thu hôm nay đạt 45.800.000đ (+12%)",
        time: "1 giờ trước",
        unread: false,
        icon: <TrendingUpOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />,
        iconBg: "bg-emerald-50",
    },
    {
        id: 4,
        title: "Kho bắp nước cảnh báo",
        desc: "Combo Bắp Phô Mai tại rạp Thủ Đức sắp hết hàng",
        time: "3 giờ trước",
        unread: false,
        icon: <FastfoodOutlinedIcon sx={{ fontSize: 18, color: "#EF4444" }} />,
        iconBg: "bg-rose-50",
    },
];

const Topbar = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const expanded = useSelector((state) => state.sidebar.expanded);
    const { logOut } = useLogout();

    const [anchorAcc, setAnchorAcc] = useState(null);
    const [anchorNotif, setAnchorNotif] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Date formatting in Vietnamese
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(today);
    // Capitalize first letter (e.g. "Thứ ba, 06/10/2026" -> "Thứ Ba, 06/10/2026")
    const displayDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

    // Dynamic current page meta
    const currentMeta = pageMeta[location.pathname] || {
        title: "Quản trị CineMeow",
        subtitle: "Hệ thống vận hành điện ảnh chuyên nghiệp",
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between shrink-0 z-20 shadow-[0_1px_6px_rgba(15,23,42,0.02)] select-none">
            {/* 1. LEFT: TOGGLE BUTTON & DYNAMIC PAGE BREADCRUMB */}
            <div className="flex items-center gap-5 min-w-0">
                {/* Sidebar Toggle Button */}
                <Tooltip title={expanded ? "Thu gọn sidebar" : "Mở rộng sidebar"} arrow disableInteractive>
                    <button
                        type="button"
                        onClick={() => dispatch(toggle())}
                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-slate-200/70 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs shrink-0"
                    >
                        {expanded ? (
                            <MenuOpenOutlinedIcon sx={{ fontSize: 20 }} />
                        ) : (
                            <MenuOutlinedIcon sx={{ fontSize: 20 }} />
                        )}
                    </button>
                </Tooltip>

                {/* Subtle Vertical Divider */}
                <div className="h-7 w-px bg-slate-200/80 shrink-0 hidden sm:block" />

                {/* Page Title & Context */}
                <div className="min-w-0">
                    <h1 className="text-base font-extrabold text-slate-900 tracking-tight leading-none truncate">
                        {currentMeta.title}
                    </h1>
                    <p className="text-[11px] font-medium text-slate-400 leading-none mt-1 truncate">
                        {currentMeta.subtitle}
                    </p>
                </div>
            </div>

            {/* 2. CENTER: GLOBAL SEARCH */}
            <div className="hidden md:flex items-center mx-6">
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200/80 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all w-64 lg:w-80 shadow-xs group">
                    <SearchOutlinedIcon sx={{ fontSize: 18 }} className="text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm phim, rạp, đơn vé..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-xs font-medium text-slate-800 placeholder:text-slate-400"
                    />
                    <kbd className="hidden lg:inline-flex text-[10px] font-mono font-bold bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-2xs">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* 3. RIGHT: DATE BADGE, NOTIFICATIONS, USER ACCOUNT */}
            <div className="flex items-center gap-3.5 shrink-0">
                {/* Live Date Badge */}
                <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-600 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                    <span>{displayDate}</span>
                </div>

                {/* Notifications Button */}
                <Tooltip title="Thông báo" arrow disableInteractive>
                    <button
                        type="button"
                        onClick={(e) => setAnchorNotif(e.currentTarget)}
                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-slate-200/70 transition-all flex items-center justify-center relative cursor-pointer active:scale-95 shadow-xs"
                    >
                        <NotificationsNoneOutlinedIcon sx={{ fontSize: 20 }} />
                        {/* Red Ping Dot */}
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                    </button>
                </Tooltip>

                {/* Quick Settings Icon */}
                <Tooltip title="Cài đặt hệ thống" arrow disableInteractive>
                    <button
                        type="button"
                        className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-violet-50 text-slate-500 hover:text-violet-600 border border-slate-200/70 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-xs"
                    >
                        <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                    </button>
                </Tooltip>

                {/* User Profile Button */}
                <button
                    type="button"
                    onClick={(e) => setAnchorAcc(e.currentTarget)}
                    className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl hover:bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all cursor-pointer shadow-xs active:scale-98 group"
                >
                    {/* Gradient Avatar with Live Dot */}
                    <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                        AD
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    {/* Admin Name & Role */}
                    <div className="hidden sm:block text-left min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-tight truncate">Quản trị viên</p>
                        <p className="text-[10px] text-slate-400 leading-tight truncate">Admin Portal</p>
                    </div>

                    <KeyboardArrowDownIcon sx={{ fontSize: 16 }} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                </button>
            </div>

            {/* NOTIFICATION MENU */}
            <Menu
                anchorEl={anchorNotif}
                open={Boolean(anchorNotif)}
                onClose={() => setAnchorNotif(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            mt: 1.5,
                            width: 360,
                            borderRadius: "16px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
                            overflow: "hidden",
                        },
                    },
                }}
            >
                {/* Notification Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">Thông báo</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                            2 mới
                        </span>
                    </div>
                    <button
                        type="button"
                        className="text-[11px] font-semibold text-violet-600 hover:text-violet-800 transition cursor-pointer"
                    >
                        Đánh dấu đã đọc
                    </button>
                </div>

                {/* Notification Items */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notificationsData.map((item) => (
                        <div
                            key={item.id}
                            className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition cursor-pointer ${
                                item.unread ? "bg-violet-50/30" : ""
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                                {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-800 leading-snug truncate">{item.title}</p>
                                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{item.desc}</p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1">{item.time}</p>
                            </div>
                            {item.unread && <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0 mt-1.5" />}
                        </div>
                    ))}
                </div>

                {/* Notification Footer */}
                <div className="p-2.5 text-center border-t border-slate-100 bg-slate-50/50">
                    <button
                        type="button"
                        onClick={() => setAnchorNotif(null)}
                        className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition cursor-pointer"
                    >
                        Xem tất cả thông báo
                    </button>
                </div>
            </Menu>

            {/* USER ACCOUNT MENU */}
            <Menu
                anchorEl={anchorAcc}
                open={Boolean(anchorAcc)}
                onClose={() => setAnchorAcc(null)}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            mt: 1.5,
                            width: 240,
                            borderRadius: "16px",
                            border: "1px solid #E2E8F0",
                            boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
                            p: 1,
                        },
                    },
                }}
            >
                {/* User Header Box */}
                <div className="px-3 py-2.5 mb-1 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">Quản trị viên CineMeow</p>
                    <p className="text-[11px] text-slate-400 truncate">admin@cinemeow.vn</p>
                </div>

                <MenuItem
                    onClick={() => setAnchorAcc(null)}
                    sx={{
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#334155",
                        py: 1,
                        "&:hover": { bgcolor: "#F8FAFC", color: "#0F172A" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: "#64748B" }}>
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    Thông tin tài khoản
                </MenuItem>

                <MenuItem
                    onClick={() => setAnchorAcc(null)}
                    sx={{
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#334155",
                        py: 1,
                        "&:hover": { bgcolor: "#F8FAFC", color: "#0F172A" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: "#64748B" }}>
                        <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    Đổi mật khẩu
                </MenuItem>

                <MenuItem
                    onClick={() => setAnchorAcc(null)}
                    sx={{
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#334155",
                        py: 1,
                        "&:hover": { bgcolor: "#F8FAFC", color: "#0F172A" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: "#64748B" }}>
                        <SettingsOutlinedIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    Cài đặt hệ thống
                </MenuItem>

                <Divider sx={{ my: 0.75, borderColor: "#F1F5F9" }} />

                <MenuItem
                    onClick={() => {
                        setAnchorAcc(null);
                        logOut();
                    }}
                    sx={{
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#E11D48",
                        py: 1,
                        "&:hover": { bgcolor: "#FFF1F2", color: "#BE123C" },
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32, color: "#E11D48" }}>
                        <LogoutOutlinedIcon sx={{ fontSize: 18 }} />
                    </ListItemIcon>
                    Đăng xuất
                </MenuItem>
            </Menu>
        </header>
    );
};

export default Topbar;
