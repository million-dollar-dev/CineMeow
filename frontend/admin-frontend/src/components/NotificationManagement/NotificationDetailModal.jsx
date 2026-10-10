import React from "react";
import { useNavigate } from "react-router-dom";
import AdminModalLayout from "../AdminModalLayout.jsx";
import {
    NOTIFICATION_CATEGORIES,
    NOTIFICATION_PRIORITIES,
} from "../../constants/notificationConstants.js";
import dayjs from "dayjs";

// Icons
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";

export default function NotificationDetailModal({
    open,
    onClose,
    notification,
    onToggleRead,
    onDelete,
}) {
    const navigate = useNavigate();

    if (!notification) return null;

    const categoryInfo = NOTIFICATION_CATEGORIES[notification.category] || NOTIFICATION_CATEGORIES.SYSTEM;
    const priorityInfo = NOTIFICATION_PRIORITIES[notification.priority] || NOTIFICATION_PRIORITIES.NORMAL;

    const getCategoryIcon = () => {
        switch (notification.category) {
            case "BOOKING":
                return <ConfirmationNumberOutlinedIcon sx={{ fontSize: 20 }} />;
            case "SHOWTIME":
                return <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />;
            case "INVENTORY":
                return <FastfoodOutlinedIcon sx={{ fontSize: 20 }} />;
            case "REVENUE":
                return <TrendingUpOutlinedIcon sx={{ fontSize: 20 }} />;
            case "PROMOTION":
                return <LoyaltyOutlinedIcon sx={{ fontSize: 20 }} />;
            default:
                return <SettingsOutlinedIcon sx={{ fontSize: 20 }} />;
        }
    };

    const handleNavigate = () => {
        if (categoryInfo.targetRoute) {
            onClose();
            navigate(categoryInfo.targetRoute);
        }
    };

    return (
        <AdminModalLayout
            open={open}
            onClose={onClose}
            maxWidth="sm"
            mode="edit"
            title="Chi Tiết Thông Báo Vận Hành"
            subtitle={`Mã thông báo hệ thống #${notification.id}`}
            badgeText={notification.id}
            icon={<NotificationsActiveOutlinedIcon sx={{ fontSize: 22 }} />}
            showSubmit={false}
            cancelLabel="Đóng"
        >
            <div className="px-6 py-6 space-y-5">
                {/* Header Info Hero */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between gap-3">
                        {/* Category & Priority Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span
                                className="px-2.5 py-1 rounded-xl text-xs font-black border flex items-center gap-1.5 shadow-2xs"
                                style={{
                                    backgroundColor: categoryInfo.bgColor,
                                    color: categoryInfo.color,
                                    borderColor: categoryInfo.borderColor,
                                }}
                            >
                                {getCategoryIcon()}
                                <span>{categoryInfo.label}</span>
                            </span>

                            <span
                                className="px-2 py-0.5 rounded-lg text-[11px] font-bold border"
                                style={{
                                    backgroundColor: priorityInfo.bgColor,
                                    color: priorityInfo.color,
                                    borderColor: priorityInfo.borderColor,
                                }}
                            >
                                {priorityInfo.badge}
                            </span>
                        </div>

                        {/* Unread Status Tag */}
                        {notification.unread ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                                Chưa đọc
                            </span>
                        ) : (
                            <span className="text-[11px] font-medium text-slate-400">Đã đọc</span>
                        )}
                    </div>

                    {/* Notification Title */}
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                        {notification.title}
                    </h3>

                    {/* Time & Branch strip */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium pt-1 border-t border-slate-100 flex-wrap">
                        <span className="flex items-center gap-1">
                            <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                            <span>{dayjs(notification.createdAt).format("HH:mm - DD/MM/YYYY")}</span>
                        </span>

                        <span className="flex items-center gap-1">
                            <StorefrontOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-400" />
                            <span>{notification.branch}</span>
                        </span>
                    </div>
                </div>

                {/* Content Body */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed font-medium space-y-1">
                    <span className="font-bold text-slate-900 block text-xs uppercase tracking-wide">
                        Nội dung chi tiết:
                    </span>
                    <p className="text-[13px] leading-relaxed text-slate-800">
                        {notification.desc}
                    </p>
                </div>

                {/* Metadata Details Grid (If present) */}
                {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">
                            Thông số kỹ thuật liên quan:
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(notification.metadata).map(([key, val]) => (
                                <div key={key} className="p-2.5 rounded-lg bg-white border border-slate-200/70">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                                        {key}
                                    </span>
                                    <span className="font-extrabold text-slate-800 text-xs truncate block mt-0.5">
                                        {typeof val === "number" && key.toLowerCase().includes("amount")
                                            ? `${val.toLocaleString("vi-VN")} ₫`
                                            : String(val)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        {/* Toggle Read/Unread */}
                        <button
                            type="button"
                            onClick={() => {
                                onToggleRead(notification);
                                onClose();
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition cursor-pointer shadow-2xs"
                        >
                            <MarkEmailReadOutlinedIcon sx={{ fontSize: 16 }} className="text-slate-500" />
                            <span>{notification.unread ? "Đánh dấu đã đọc" : "Đánh dấu chưa đọc"}</span>
                        </button>

                        {/* Delete */}
                        <button
                            type="button"
                            onClick={() => {
                                onDelete(notification);
                                onClose();
                            }}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                            title="Xóa thông báo này"
                        >
                            <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                        </button>
                    </div>

                    {/* Navigate to module */}
                    <button
                        type="button"
                        onClick={handleNavigate}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 transition cursor-pointer"
                    >
                        <span>Mở trang liên quan</span>
                        <ArrowForwardOutlinedIcon sx={{ fontSize: 16 }} />
                    </button>
                </div>
            </div>
        </AdminModalLayout>
    );
}
