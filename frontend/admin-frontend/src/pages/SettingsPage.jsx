import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import {
    Button,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";

// Redux
import { openSnackbar } from "../redux/slices/snackbarSlice.js";

// Constants & Defaults
import {
    SETTINGS_STORAGE_KEY,
    DEFAULT_APP_SETTINGS,
    SETTINGS_TABS,
} from "../constants/settingsConstants.js";

// Components
import StatCard from "../components/OverviewStats/StatCard.jsx";

// Icons
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LoyaltyOutlinedIcon from "@mui/icons-material/LoyaltyOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import EventSeatOutlinedIcon from "@mui/icons-material/EventSeatOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

export default function SettingsPage() {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);

    // 1. Initial State from localStorage with fallback
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...DEFAULT_APP_SETTINGS,
                    ...parsed,
                    booking: { ...DEFAULT_APP_SETTINGS.booking, ...(parsed.booking || {}) },
                    payment: {
                        ...DEFAULT_APP_SETTINGS.payment,
                        ...(parsed.payment || {}),
                        gateways: parsed.payment?.gateways || DEFAULT_APP_SETTINGS.payment.gateways,
                    },
                    loyalty: { ...DEFAULT_APP_SETTINGS.loyalty, ...(parsed.loyalty || {}) },
                    notifications: { ...DEFAULT_APP_SETTINGS.notifications, ...(parsed.notifications || {}) },
                    general: { ...DEFAULT_APP_SETTINGS.general, ...(parsed.general || {}) },
                };
            }
        } catch (e) {
            console.error("Failed to parse settings from localStorage:", e);
        }
        return DEFAULT_APP_SETTINGS;
    });

    const [activeTab, setActiveTab] = useState("booking");
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [confirmResetOpen, setConfirmResetOpen] = useState(false);

    // Calculate active payment gateways count
    const activeGatewaysCount = useMemo(() => {
        return settings.payment?.gateways?.filter((g) => g.enabled).length || 0;
    }, [settings.payment]);

    // Top Stat KPI Cards
    const stats = useMemo(
        () => [
            {
                title: "Thời gian giữ ghế",
                value: `${settings.booking.seatHoldTimeoutMinutes} Phút`,
                subtitle: "Tự động hoàn trả khi hết hạn",
                icon: <TimerOutlinedIcon fontSize="medium" />,
                bigIcon: <TimerOutlinedIcon fontSize="inherit" />,
                bgColor: "#7C3AED", // Violet
            },
            {
                title: "Cổng thanh toán",
                value: `${activeGatewaysCount} Cổng bật`,
                subtitle: "VNPay, MoMo, ZaloPay, Thẻ QT",
                icon: <PaymentsOutlinedIcon fontSize="medium" />,
                bigIcon: <PaymentsOutlinedIcon fontSize="inherit" />,
                bgColor: "#10B981", // Emerald
            },
            {
                title: "Tỷ lệ tích điểm",
                value: `${settings.loyalty.earnPointRate}% Hóa đơn`,
                subtitle: `1 Điểm = ${(settings.loyalty.pointRedeemValue || 1000).toLocaleString("vi-VN")} ₫`,
                icon: <LoyaltyOutlinedIcon fontSize="medium" />,
                bigIcon: <LoyaltyOutlinedIcon fontSize="inherit" />,
                bgColor: "#F59E0B", // Amber
            },
            {
                title: "Trạng thái vận hành",
                value: settings.general.maintenanceMode ? "Đang bảo trì" : "Trực tuyến 100%",
                subtitle: settings.general.maintenanceMode ? "Tạm đóng kênh đặt vé" : "Mọi dịch vụ hoạt động",
                icon: <ShieldOutlinedIcon fontSize="medium" />,
                bigIcon: <ShieldOutlinedIcon fontSize="inherit" />,
                bgColor: settings.general.maintenanceMode ? "#EF4444" : "#0284C7", // Rose / Sky
            },
        ],
        [settings, activeGatewaysCount]
    );

    // Helpers to update nested state
    const updateSection = (section, key, value) => {
        setSettings((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
        setHasUnsavedChanges(true);
    };

    // Helper to toggle or update a specific gateway
    const updateGateway = (gatewayId, key, value) => {
        setSettings((prev) => {
            const updated = prev.payment.gateways.map((g) =>
                g.id === gatewayId ? { ...g, [key]: value } : g
            );
            return {
                ...prev,
                payment: {
                    ...prev.payment,
                    gateways: updated,
                },
            };
        });
        setHasUnsavedChanges(true);
    };

    // Save settings to localStorage
    const handleSaveSettings = () => {
        setIsSaving(true);
        setTimeout(() => {
            try {
                localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
                setIsSaving(false);
                setHasUnsavedChanges(false);
                dispatch(
                    openSnackbar({
                        message: "Lưu cấu hình hệ thống ứng dụng CineMeow thành công!",
                        type: "success",
                    })
                );
            } catch (error) {
                setIsSaving(false);
                dispatch(
                    openSnackbar({
                        message: "Lỗi lưu cấu hình: " + error.message,
                        type: "error",
                    })
                );
            }
        }, 350);
    };

    // Reset to defaults
    const handleConfirmReset = () => {
        setSettings(DEFAULT_APP_SETTINGS);
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
        setConfirmResetOpen(false);
        setHasUnsavedChanges(false);
        dispatch(
            openSnackbar({
                message: "Đã khôi phục toàn bộ cấu hình về giá trị mặc định của nhà sản xuất!",
                type: "info",
            })
        );
    };

    // Export configuration to JSON file
    const handleExportConfig = () => {
        try {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `cinemeow_settings_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            dispatch(
                openSnackbar({
                    message: "Đã xuất file cấu hình JSON thành công!",
                    type: "success",
                })
            );
        } catch (error) {
            dispatch(
                openSnackbar({
                    message: "Lỗi xuất file: " + error.message,
                    type: "error",
                })
            );
        }
    };

    // Import configuration from JSON file
    const handleImportConfig = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result);
                if (!imported.booking || !imported.payment) {
                    throw new Error("File cấu hình không đúng định dạng CineMeow.");
                }
                setSettings({
                    ...DEFAULT_APP_SETTINGS,
                    ...imported,
                    booking: { ...DEFAULT_APP_SETTINGS.booking, ...(imported.booking || {}) },
                    payment: {
                        ...DEFAULT_APP_SETTINGS.payment,
                        ...(imported.payment || {}),
                        gateways: imported.payment?.gateways || DEFAULT_APP_SETTINGS.payment.gateways,
                    },
                    loyalty: { ...DEFAULT_APP_SETTINGS.loyalty, ...(imported.loyalty || {}) },
                    notifications: { ...DEFAULT_APP_SETTINGS.notifications, ...(imported.notifications || {}) },
                    general: { ...DEFAULT_APP_SETTINGS.general, ...(imported.general || {}) },
                });
                setHasUnsavedChanges(true);
                dispatch(
                    openSnackbar({
                        message: "Đã tải cấu hình từ file! Vui lòng bấm 'Lưu cấu hình' để áp dụng.",
                        type: "success",
                    })
                );
            } catch (err) {
                dispatch(
                    openSnackbar({
                        message: "Không thể nhập cấu hình: " + err.message,
                        type: "error",
                    })
                );
            }
        };
        reader.readAsText(file);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="w-full pb-10">
            {/* Hidden file input for import */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportConfig}
                accept=".json"
                className="hidden"
            />

            {/* 1. HEADER BANNER (Strict Design System Standard) */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <SettingsOutlinedIcon className="text-violet-600" sx={{ fontSize: 28 }} />
                            <span>Cấu hình hệ thống</span>
                        </h2>
                        {hasUnsavedChanges && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                Có thay đổi chưa lưu
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Quản lý quy tắc giữ chỗ, cổng thanh toán trực tuyến, điểm thưởng thành viên, vé điện tử và vận hành hệ thống CineMeow
                    </p>
                </div>

                {/* Action Buttons: 2x2 grid on mobile, single flex row on tablet & desktop */}
                <div className="grid grid-cols-2 sm:flex sm:flex-nowrap sm:items-center gap-2 sm:gap-2.5 w-full xl:w-auto shrink-0 justify-start xl:justify-end">
                    {/* Reset Button */}
                    <Button
                        variant="outlined"
                        onClick={() => setConfirmResetOpen(true)}
                        startIcon={<RestartAltOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            height: "38px",
                            minHeight: "38px",
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            backgroundColor: "#FFFFFF",
                            color: "#475569",
                            px: { xs: 1.5, sm: 2 },
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Đặt lại mặc định
                    </Button>

                    {/* Export JSON Button */}
                    <Button
                        variant="outlined"
                        onClick={handleExportConfig}
                        startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            height: "38px",
                            minHeight: "38px",
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            backgroundColor: "#FFFFFF",
                            color: "#475569",
                            px: { xs: 1.5, sm: 2 },
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Xuất JSON
                    </Button>

                    {/* Import JSON Button */}
                    <Button
                        variant="outlined"
                        onClick={() => fileInputRef.current?.click()}
                        startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 18 }} />}
                        sx={{
                            height: "38px",
                            minHeight: "38px",
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontWeight: 700,
                            fontSize: "12px",
                            borderRadius: "12px",
                            borderColor: "#E2E8F0",
                            backgroundColor: "#FFFFFF",
                            color: "#475569",
                            px: { xs: 1.5, sm: 2 },
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                            "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                        }}
                    >
                        Nhập file
                    </Button>

                    {/* Save Button */}
                    <Button
                        variant="contained"
                        onClick={handleSaveSettings}
                        disabled={isSaving}
                        startIcon={
                            isSaving ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                            )
                        }
                        sx={{
                            height: "38px",
                            minHeight: "38px",
                            whiteSpace: "nowrap",
                            textTransform: "none",
                            fontWeight: 800,
                            fontSize: "12px",
                            borderRadius: "12px",
                            px: { xs: 2, sm: 2.5 },
                            background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                            boxShadow: "0 8px 16px -4px rgba(124, 58, 237, 0.35)",
                            "&:hover": {
                                background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                            },
                        }}
                    >
                        {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
                    </Button>
                </div>
            </div>

            {/* 2. STATS KPI OVERVIEW GRID (Strict CSS Grid Standard) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        bigIcon={stat.bigIcon}
                        bgColor={stat.bgColor}
                        loading={false}
                    />
                ))}
            </div>

            {/* 3. MAIN WORKSPACE (Full Width) */}
            <div className="w-full flex flex-col gap-6">
                {/* TAB NAVIGATION PILLS */}
                    <div className="bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap gap-1.5">
                        {SETTINGS_TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                        isActive
                                            ? "bg-violet-600 text-white shadow-md shadow-violet-600/20"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                                            isActive
                                                ? "bg-white/20 text-white"
                                                : "bg-slate-100 text-slate-500"
                                        }`}
                                    >
                                        {tab.badge}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* TAB PANEL 1: ĐẶT VÉ & GIỮ GHẾ */}
                    {activeTab === "booking" && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <ConfirmationNumberOutlinedIcon className="text-violet-600" sx={{ fontSize: 20 }} />
                                    <span>Quy tắc đặt vé & Khóa giữ chỗ</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Cấu hình cơ chế giải phóng ghế tự động, số vé tối đa và các thuật toán xếp chỗ thông minh
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Seat Hold Timeout */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 transition-all space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <TimerOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                            <span>Thời gian giữ ghế tạm thời</span>
                                        </label>
                                        <span className="text-xs font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">
                                            {settings.booking.seatHoldTimeoutMinutes} phút
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Thời gian tối đa khách hàng có để hoàn tất thanh toán trước khi ghế tự động mở lại cho người khác.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="range"
                                            min="3"
                                            max="20"
                                            step="1"
                                            value={settings.booking.seatHoldTimeoutMinutes}
                                            onChange={(e) => updateSection("booking", "seatHoldTimeoutMinutes", Number(e.target.value))}
                                            className="w-full accent-violet-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[5, 10, 15].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateSection("booking", "seatHoldTimeoutMinutes", val)}
                                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                                                    settings.booking.seatHoldTimeoutMinutes === val
                                                        ? "border-violet-600 bg-violet-50 text-violet-700"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {val} phút
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Max Tickets Per Order */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 transition-all space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <EventSeatOutlinedIcon sx={{ fontSize: 16 }} className="text-indigo-600" />
                                            <span>Số vé tối đa / 1 đơn hàng</span>
                                        </label>
                                        <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                            {settings.booking.maxTicketsPerOrder} vé
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Hạn chế đầu cơ vé đối với các phim bom tấn và suất chiếu đặc biệt vào dịp cao điểm.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="range"
                                            min="2"
                                            max="16"
                                            step="1"
                                            value={settings.booking.maxTicketsPerOrder}
                                            onChange={(e) => updateSection("booking", "maxTicketsPerOrder", Number(e.target.value))}
                                            className="w-full accent-indigo-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[4, 6, 8, 10].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateSection("booking", "maxTicketsPerOrder", val)}
                                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                                                    settings.booking.maxTicketsPerOrder === val
                                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {val} vé
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Stop Online Booking Before Showtime */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 transition-all space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <LockResetOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-600" />
                                            <span>Ngừng bán online trước giờ chiếu</span>
                                        </label>
                                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                                            {settings.booking.stopBookingBeforeShowtimeMinutes} phút
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Sau mốc thời gian này, vé chỉ còn được bán trực tiếp tại quầy vé POS của rạp.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="60"
                                            step="5"
                                            value={settings.booking.stopBookingBeforeShowtimeMinutes}
                                            onChange={(e) => updateSection("booking", "stopBookingBeforeShowtimeMinutes", Number(e.target.value))}
                                            className="w-full accent-amber-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[0, 10, 15, 30].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateSection("booking", "stopBookingBeforeShowtimeMinutes", val)}
                                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                                                    settings.booking.stopBookingBeforeShowtimeMinutes === val
                                                        ? "border-amber-600 bg-amber-50 text-amber-700"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {val === 0 ? "Sát giờ" : `${val} phút`}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Cleaning Buffer Minutes */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-violet-300 transition-all space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <BuildCircleOutlinedIcon sx={{ fontSize: 16 }} className="text-teal-600" />
                                            <span>Khoảng nghỉ dọn phòng giữa 2 suất</span>
                                        </label>
                                        <span className="text-xs font-black text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                                            {settings.booking.cleaningBufferMinutes} phút
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Thời gian đệm tối thiểu để nhân viên vệ sinh rạp, kiểm tra thiết bị âm thanh và chuẩn bị suất kế tiếp.
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <input
                                            type="range"
                                            min="10"
                                            max="45"
                                            step="5"
                                            value={settings.booking.cleaningBufferMinutes}
                                            onChange={(e) => updateSection("booking", "cleaningBufferMinutes", Number(e.target.value))}
                                            className="w-full accent-teal-600 cursor-pointer"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 pt-1">
                                        {[15, 20, 25, 30].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateSection("booking", "cleaningBufferMinutes", val)}
                                                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition ${
                                                    settings.booking.cleaningBufferMinutes === val
                                                        ? "border-teal-600 bg-teal-50 text-teal-700"
                                                        : "border-slate-200 text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {val} phút
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Feature Toggles */}
                            <div className="pt-2 space-y-3">
                                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                    Tính năng thuật toán thông minh
                                </h4>

                                {/* Toggle: Chống tạo ghế cô đơn */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-800">
                                                Thuật toán chống để lại ghế cô đơn (Orphan Seat Prevention)
                                            </span>
                                            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-md">
                                                Khuyên dùng
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Ngăn người dùng để lại đúng 1 ghế trống đơn độc giữa 2 ghế đã đặt hoặc cạnh lối đi, giúp tối ưu 100% công suất rạp.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.booking.preventSingleOrphanSeat}
                                            onChange={(e) => updateSection("booking", "preventSingleOrphanSeat", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                                    </label>
                                </div>

                                {/* Toggle: Gợi ý bán kèm F&B */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-800">
                                                Bán kèm Combo Bắp Nước (F&B Cross-Sell)
                                            </span>
                                            <FastfoodOutlinedIcon className="text-amber-500" sx={{ fontSize: 16 }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Tự động hiển thị màn hình chọn bắp nước ưu đãi ngay sau bước chọn ghế trước khi vào cổng thanh toán.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.booking.enableComboUpsell}
                                            onChange={(e) => updateSection("booking", "enableComboUpsell", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                                    </label>
                                </div>

                                {/* Toggle: Chuyển nhượng vé qua số điện thoại */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800">
                                            Cho phép khách hàng chuyển nhượng vé online
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Người mua có thể tặng vé cho bạn bè thông qua số điện thoại hoặc email đã đăng ký thành viên CineMeow.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.booking.allowTicketTransfer}
                                            onChange={(e) => updateSection("booking", "allowTicketTransfer", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB PANEL 2: CỔNG THANH TOÁN & TÀI CHÍNH */}
                    {activeTab === "payment" && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <PaymentsOutlinedIcon className="text-emerald-600" sx={{ fontSize: 20 }} />
                                    <span>Cổng thanh toán & Chính sách tài chính</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Kích hoạt các cổng thanh toán trực tuyến, thuế VAT và cơ chế tự động hoàn tiền
                                </p>
                            </div>

                            {/* Gateways List */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                                        Danh sách cổng thanh toán trực tuyến ({activeGatewaysCount}/5 đang bật)
                                    </h4>
                                </div>

                                {settings.payment.gateways.map((gw) => (
                                    <div
                                        key={gw.id}
                                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                                            gw.enabled
                                                ? "border-slate-200/90 bg-white shadow-2xs hover:border-violet-300"
                                                : "border-slate-200/60 bg-slate-50/50 opacity-70"
                                        }`}
                                    >
                                        <div className="flex items-start gap-3.5">
                                            {/* Brand Logo Box */}
                                            <div
                                                className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0 shadow-xs"
                                                style={{ backgroundColor: gw.color }}
                                            >
                                                {gw.code}
                                            </div>

                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-xs font-bold text-slate-800">{gw.name}</span>
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                                                        {gw.badge}
                                                    </span>
                                                    {gw.isSandbox ? (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                                            Sandbox Test
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            Production Live
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-slate-400">{gw.description}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                                            {/* Sandbox Toggle */}
                                            <button
                                                type="button"
                                                onClick={() => updateGateway(gw.id, "isSandbox", !gw.isSandbox)}
                                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                                    gw.isSandbox
                                                        ? "border-amber-300 bg-amber-50 text-amber-700"
                                                        : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                                }`}
                                            >
                                                {gw.isSandbox ? "Chế độ Test" : "Chế độ Live"}
                                            </button>

                                            {/* Enable Toggle */}
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={gw.enabled}
                                                    onChange={(e) => updateGateway(gw.id, "enabled", e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Financial & Invoicing Rules */}
                            <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* VAT Rate */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <ReceiptLongOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                            <span>Thuế suất VAT xuất hóa đơn</span>
                                        </label>
                                        <span className="text-xs font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">
                                            {settings.payment.vatRatePercent}%
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Mức thuế suất giá trị gia tăng áp dụng khi xuất hóa đơn bán vé và dịch vụ bắp nước.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[0, 5, 8, 10].map((rate) => (
                                            <button
                                                key={rate}
                                                type="button"
                                                onClick={() => updateSection("payment", "vatRatePercent", rate)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.payment.vatRatePercent === rate
                                                        ? "border-violet-600 bg-violet-50 text-violet-700 shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {rate}% VAT
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Timeout */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <TimerOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                            <span>Thời gian chờ cổng thanh toán</span>
                                        </label>
                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                            {settings.payment.paymentTimeoutSeconds} giây
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Thời gian tối đa chờ phản hồi webhook IPN từ VNPay, MoMo trước khi hủy giao dịch.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[180, 300, 480, 600].map((sec) => (
                                            <button
                                                key={sec}
                                                type="button"
                                                onClick={() => updateSection("payment", "paymentTimeoutSeconds", sec)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.payment.paymentTimeoutSeconds === sec
                                                        ? "border-blue-600 bg-blue-50 text-blue-700 shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {sec / 60} phút
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Payment Toggles */}
                            <div className="space-y-3">
                                {/* Auto Refund Toggle */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800">
                                            Tự động hoàn tiền khi giao dịch giữ chỗ thất bại
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Nếu tiền đã trừ từ tài khoản ngân hàng nhưng hệ thống ghi nhận quá hạn giữ ghế, tự động hoàn trả 100% tiền vào ví CinePoint hoặc tài khoản gốc.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.payment.autoRefundOnFailure}
                                            onChange={(e) => updateSection("payment", "autoRefundOnFailure", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                                    </label>
                                </div>

                                {/* E-Invoice Toggle */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800">
                                            Tự động phát hành Hóa đơn điện tử (E-Invoice)
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Tự động tạo số hóa đơn GTGT hợp lệ của Tổng cục Thuế và gửi link tra cứu về email người đặt.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.payment.enableEInvoice}
                                            onChange={(e) => updateSection("payment", "enableEInvoice", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB PANEL 3: THÀNH VIÊN & TÍCH ĐIỂM (CineMeow Rewards) */}
                    {activeTab === "loyalty" && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <LoyaltyOutlinedIcon className="text-amber-500" sx={{ fontSize: 20 }} />
                                    <span>Hội viên CineMeow Club & Điểm thưởng CinePoint</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Cấu hình tỷ lệ hoàn điểm, quy đổi điểm sang tiền mặt và chính sách quà tặng thành viên mới
                                </p>
                            </div>

                            {/* Loyalty Master Switch */}
                            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-900">
                                        Kích hoạt chương trình khách hàng thân thiết CineMeow Club
                                    </span>
                                    <p className="text-[11px] text-slate-600">
                                        Khi bật, khách hàng đăng nhập sẽ được tự động tích lũy CinePoint khi mua vé và bắp nước.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.loyalty.enableLoyaltyProgram}
                                        onChange={(e) => updateSection("loyalty", "enableLoyaltyProgram", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                                </label>
                            </div>

                            {/* Loyalty Rates Form */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Earn Point Rate */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800">
                                            Tỷ lệ tích điểm (% Hóa đơn)
                                        </label>
                                        <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                                            {settings.loyalty.earnPointRate}%
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Ví dụ: Hóa đơn 100.000 ₫ với tỷ lệ 5% sẽ tích được 5 điểm CinePoint.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[3, 5, 7, 10].map((rate) => (
                                            <button
                                                key={rate}
                                                type="button"
                                                onClick={() => updateSection("loyalty", "earnPointRate", rate)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.loyalty.earnPointRate === rate
                                                        ? "border-amber-500 bg-amber-50 text-amber-700 shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {rate}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Point Redeem Value */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800">
                                            Giá trị quy đổi (1 CinePoint)
                                        </label>
                                        <span className="text-xs font-black text-violet-600 bg-violet-50 px-2.5 py-1 rounded-lg">
                                            {settings.loyalty.pointRedeemValue.toLocaleString("vi-VN")} ₫
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Giá trị quy đổi trực tiếp khi dùng điểm để khấu trừ tiền mua vé xem phim.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[500, 1000, 2000].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateSection("loyalty", "pointRedeemValue", val)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.loyalty.pointRedeemValue === val
                                                        ? "border-violet-600 bg-violet-50 text-violet-700 shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {val.toLocaleString("vi-VN")} ₫
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Max Point Redeem Percent */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800">
                                            Mức khấu trừ điểm tối đa / 1 đơn
                                        </label>
                                        <span className="text-xs font-black text-slate-800 bg-slate-200/70 px-2.5 py-1 rounded-lg">
                                            Tối đa {settings.loyalty.maxPointRedeemPercent}%
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Khách hàng chỉ được dùng điểm thanh toán tối đa tỷ lệ này trên tổng giá trị đơn hàng.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[30, 50, 70, 100].map((pct) => (
                                            <button
                                                key={pct}
                                                type="button"
                                                onClick={() => updateSection("loyalty", "maxPointRedeemPercent", pct)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.loyalty.maxPointRedeemPercent === pct
                                                        ? "border-slate-900 bg-slate-900 text-white shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                {pct}%
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Welcome Points */}
                                <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-bold text-slate-800">
                                            Điểm thưởng chào mừng thành viên mới
                                        </label>
                                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                            +{settings.loyalty.welcomePoints} Điểm
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Tặng ngay vào ví điểm khi tài khoản mới xác thực số điện thoại và email thành công.
                                    </p>
                                    <div className="flex items-center gap-2 pt-2">
                                        {[10, 20, 50, 100].map((pts) => (
                                            <button
                                                key={pts}
                                                type="button"
                                                onClick={() => updateSection("loyalty", "welcomePoints", pts)}
                                                className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                                                    settings.loyalty.welcomePoints === pts
                                                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 shadow-2xs"
                                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                }`}
                                            >
                                                +{pts}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Loyalty Toggles */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-4">
                                <div className="space-y-0.5">
                                    <span className="text-xs font-bold text-slate-800">
                                        Tự động nâng hạng thẻ thành viên theo chi tiêu năm (Auto-tiering)
                                    </span>
                                    <p className="text-[11px] text-slate-500">
                                        Tự động nâng cấp hạng thẻ: Member → Silver (tích lũy &gt; 1 triệu) → Gold (&gt; 3 triệu) → Diamond (&gt; 7 triệu).
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        checked={settings.loyalty.autoTierUpgrade}
                                        onChange={(e) => updateSection("loyalty", "autoTierUpgrade", e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* TAB PANEL 4: VÉ ĐIỆN TỬ & THÔNG BÁO */}
                    {activeTab === "notifications" && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <NotificationsActiveOutlinedIcon className="text-blue-600" sx={{ fontSize: 20 }} />
                                    <span>Vé điện tử QR & Kênh thông báo khách hàng</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Quản lý mã QR động chống gian lận, gửi thông báo qua ZNS/Email và chính sách tự hủy vé
                                </p>
                            </div>

                            {/* E-Ticket QR Configuration */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-800">
                                                Kích hoạt Vé điện tử với mã QR động chống gian lận
                                            </span>
                                            <QrCode2OutlinedIcon className="text-violet-600" sx={{ fontSize: 18 }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Mã QR trên app sẽ tự động xoay vòng mã bảo mật định kỳ để chống chụp ảnh màn hình bán lại vé giả.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.enableQrTicket}
                                            onChange={(e) => updateSection("notifications", "enableQrTicket", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                                    </label>
                                </div>

                                {settings.notifications.enableQrTicket && (
                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                        <span className="text-xs font-medium text-slate-600">
                                            Chu kỳ đổi mới mã QR bảo mật:
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            {[15, 30, 60].map((interval) => (
                                                <button
                                                    key={interval}
                                                    type="button"
                                                    onClick={() => updateSection("notifications", "dynamicQrIntervalSeconds", interval)}
                                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                                                        settings.notifications.dynamicQrIntervalSeconds === interval
                                                            ? "border-violet-600 bg-violet-50 text-violet-700"
                                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {interval} giây
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Notification Channels */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Email Ticket */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <EmailOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                            <span>Gửi vé điện tử qua Email</span>
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Tự động gửi email kèm file PDF vé và mã barcode khi thanh toán thành công.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.sendEmailTicket}
                                            onChange={(e) => updateSection("notifications", "sendEmailTicket", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
                                    </label>
                                </div>

                                {/* SMS / Zalo ZNS */}
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 flex items-center justify-between gap-3">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                            <PhoneInTalkOutlinedIcon sx={{ fontSize: 16 }} className="text-emerald-600" />
                                            <span>Gửi tin nhắn Zalo ZNS / SMS</span>
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Gửi tin nhắn xác nhận mã đơn và số ghế qua Official Account Zalo CineMeow.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.sendSmsZnsNotification}
                                            onChange={(e) => updateSection("notifications", "sendSmsZnsNotification", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                                    </label>
                                </div>
                            </div>

                            {/* Ticket Cancellation Policy */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-800">
                                            Chính sách cho phép khách hàng tự hủy vé trên App
                                        </span>
                                        <p className="text-[11px] text-slate-500">
                                            Cho phép người dùng bấm "Hủy vé" trực tiếp trên lịch sử đơn hàng để nhận hoàn tiền hoặc điểm CinePoint.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.notifications.allowTicketCancellation}
                                            onChange={(e) => updateSection("notifications", "allowTicketCancellation", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
                                    </label>
                                </div>

                                {settings.notifications.allowTicketCancellation && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                                        {/* Cutoff Time */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-slate-700">
                                                    Hạn hủy vé tối thiểu trước giờ chiếu:
                                                </label>
                                                <span className="text-xs font-bold text-rose-600">
                                                    {settings.notifications.cancellationCutoffMinutes} phút
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {[60, 120, 180].map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => updateSection("notifications", "cancellationCutoffMinutes", val)}
                                                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition ${
                                                            settings.notifications.cancellationCutoffMinutes === val
                                                                ? "border-rose-600 bg-rose-50 text-rose-700"
                                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {val / 60} tiếng
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Cancellation Fee */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-medium text-slate-700">
                                                    Phí khấu trừ khi hủy vé (% giá vé):
                                                </label>
                                                <span className="text-xs font-bold text-slate-800">
                                                    {settings.notifications.cancellationFeePercent}%
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {[0, 10, 20, 30].map((val) => (
                                                    <button
                                                        key={val}
                                                        type="button"
                                                        onClick={() => updateSection("notifications", "cancellationFeePercent", val)}
                                                        className={`flex-1 py-1 rounded-lg text-[11px] font-bold border transition ${
                                                            settings.notifications.cancellationFeePercent === val
                                                                ? "border-slate-900 bg-slate-900 text-white"
                                                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                        }`}
                                                    >
                                                        {val === 0 ? "Miễn phí" : `${val}%`}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TAB PANEL 5: THƯƠNG HIỆU & VẬN HÀNH */}
                    {activeTab === "general" && (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 space-y-6">
                            <div className="border-b border-slate-100 pb-4">
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <TuneOutlinedIcon className="text-violet-600" sx={{ fontSize: 20 }} />
                                    <span>Thông tin thương hiệu & Trạng thái vận hành</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Cấu hình tổng đài hỗ trợ, email CSKH, chế độ bảo trì khẩn cấp và thông báo toàn hệ thống
                                </p>
                            </div>

                            {/* Brand Info Form */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Tên nền tảng hiển thị
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.appName}
                                        onChange={(e) => updateSection("general", "appName", e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Hotline hỗ trợ khách hàng
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.hotline}
                                        onChange={(e) => updateSection("general", "hotline", e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Email chăm sóc khách hàng
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.general.supportEmail}
                                        onChange={(e) => updateSection("general", "supportEmail", e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                        Đường dẫn Điều khoản & Chính sách
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.general.termsUrl}
                                        onChange={(e) => updateSection("general", "termsUrl", e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 focus:outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Maintenance Mode (Alert Box) */}
                            <div className={`p-4 rounded-xl border transition-all ${
                                settings.general.maintenanceMode
                                    ? "border-rose-300 bg-rose-50/60"
                                    : "border-slate-200 bg-slate-50/40"
                            }`}>
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900">
                                                Chế độ bảo trì hệ thống (Maintenance Mode)
                                            </span>
                                            {settings.general.maintenanceMode && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                                                    Đang kích hoạt
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Khi bật, toàn bộ ứng dụng Client sẽ tạm dừng cho phép đặt vé mới và hiển thị màn hình bảo trì nâng cấp.
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.general.maintenanceMode}
                                            onChange={(e) => updateSection("general", "maintenanceMode", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
                                    </label>
                                </div>

                                {settings.general.maintenanceMode && (
                                    <div className="mt-3 pt-3 border-t border-rose-200">
                                        <label className="block text-[11px] font-bold text-rose-800 mb-1">
                                            Thông điệp bảo trì hiển thị tới khách hàng:
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={settings.general.maintenanceMessage}
                                            onChange={(e) => updateSection("general", "maintenanceMessage", e.target.value)}
                                            className="w-full p-2.5 text-xs font-medium rounded-xl border border-rose-200 bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Broadcast Alert Banner */}
                            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-900">
                                                Thông báo khẩn cấp toàn hệ thống (Broadcast Announcement)
                                            </span>
                                            <CampaignOutlinedIcon className="text-amber-500" sx={{ fontSize: 18 }} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Hiển thị một thanh banner nổi bật ở đầu trang ứng dụng khách hàng (khuyến mãi đặc biệt, bão tuyết hoặc cập nhật).
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                        <input
                                            type="checkbox"
                                            checked={settings.general.broadcastAlertEnabled}
                                            onChange={(e) => updateSection("general", "broadcastAlertEnabled", e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                                    </label>
                                </div>

                                {settings.general.broadcastAlertEnabled && (
                                    <div className="pt-2 border-t border-slate-200/60">
                                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                            Nội dung thông báo phát thanh:
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.general.broadcastAlertMessage}
                                            onChange={(e) => updateSection("general", "broadcastAlertMessage", e.target.value)}
                                            className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* FLOATING BOTTOM SAVE BAR WHEN HAS UNSAVED CHANGES */}
            {hasUnsavedChanges && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 transition-all animate-bounce-subtle">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-xs font-bold text-slate-100">
                            Bạn có thay đổi cấu hình chưa lưu
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setConfirmResetOpen(true)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                        >
                            Khôi phục
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveSettings}
                            disabled={isSaving}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-600/30 transition cursor-pointer flex items-center gap-1.5"
                        >
                            {isSaving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                            <span>{isSaving ? "Đang lưu..." : "Lưu thay đổi"}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* CONFIRM RESET DIALOG */}
            <Dialog
                open={confirmResetOpen}
                onClose={() => setConfirmResetOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "20px",
                        p: 1,
                        maxWidth: "440px",
                        boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 800, fontSize: "16px", color: "#0F172A", pb: 1 }}>
                    Khôi phục cấu hình mặc định?
                </DialogTitle>
                <DialogContent>
                    <p className="text-xs text-slate-600 leading-relaxed">
                        Thao tác này sẽ đặt lại tất cả các thông số đặt vé, cổng thanh toán, điểm thưởng và thông báo về giá trị tiêu chuẩn ban đầu. Bạn có chắc chắn muốn thực hiện?
                    </p>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2, pt: 1, gap: 1 }}>
                    <Button
                        onClick={() => setConfirmResetOpen(false)}
                        sx={{
                            textTransform: "none",
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#64748B",
                            borderRadius: "10px",
                        }}
                    >
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleConfirmReset}
                        variant="contained"
                        sx={{
                            textTransform: "none",
                            fontSize: "12px",
                            fontWeight: 800,
                            borderRadius: "10px",
                            bgcolor: "#EF4444",
                            "&:hover": { bgcolor: "#DC2626" },
                        }}
                    >
                        Đặt lại ngay
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
