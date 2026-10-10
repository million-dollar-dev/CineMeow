import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tooltip,
} from "@mui/material";
import dayjs from "dayjs";

// Icons
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";

// Components
import StatusChip from "../StatusChip.jsx";

// Constants
import {
    BOOKING_STATUSES,
    BOOKING_STATUS_CONFIG,
    PAYMENT_METHODS,
} from "../../constants/bookingConstants.js";
import { MEMBERSHIP_TIERS } from "../../constants/accountConstants.js";

export default function BookingDetailModal({
    open,
    onClose,
    booking,
    onCheckIn,
    onRefund,
    onResendTicket,
}) {
    const [activeTab, setActiveTab] = useState("TICKET"); // "TICKET" | "PAYMENT" | "HISTORY"
    const [copied, setCopied] = useState(false);

    if (!booking) return null;

    const statusConfig = BOOKING_STATUSES[booking.orderStatus] || BOOKING_STATUSES.PENDING;
    const paymentMethodConfig = PAYMENT_METHODS[booking.paymentMethod] || {
        label: booking.paymentMethod,
        shortLabel: booking.paymentMethod,
        bgLight: "bg-slate-100 text-slate-700",
    };

    const handleCopyTicketCode = () => {
        if (booking.ticketCode) {
            navigator.clipboard.writeText(booking.ticketCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatCurrency = (amount) => {
        return (amount || 0).toLocaleString("vi-VN") + " ₫";
    };

    const getCustomerTier = (tierCode) => {
        const key = String(tierCode || "STANDARD").toUpperCase();
        if (key === "DIAMOND" || key === "PLATINUM") return MEMBERSHIP_TIERS.PLATINUM;
        if (key === "GOLD") return MEMBERSHIP_TIERS.GOLD;
        if (key === "SILVER") return MEMBERSHIP_TIERS.SILVER;
        return MEMBERSHIP_TIERS.STANDARD;
    };

    const customerTier = getCustomerTier(booking.customer?.tier);
    const customerInitials = booking.customer?.name
        ? booking.customer.name
              .split(" ")
              .filter(Boolean)
              .slice(-2)
              .map((w) => w[0])
              .join("")
              .toUpperCase()
        : "KH";

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "24px",
                    maxHeight: "92vh",
                    boxShadow: "0 25px 60px -15px rgba(15, 23, 42, 0.35)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            {/* Top Stripe Gradient */}
            <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-500 shrink-0" />

            {/* Modal Header */}
            <DialogTitle
                sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #F1F5F9",
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shadow-2xs">
                        <ReceiptLongOutlinedIcon sx={{ fontSize: 24 }} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                Chi Tiết Đơn Đặt Vé
                            </h3>
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                                {booking.orderCode}
                            </span>
                            <StatusChip status={booking.orderStatus} configs={BOOKING_STATUS_CONFIG} />
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                            Khởi tạo lúc: {dayjs(booking.createdAt).format("HH:mm:ss - DD/MM/YYYY")}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 20 }} />
                </button>
            </DialogTitle>

            {/* Sub-Header Navigation Tabs */}
            <div className="px-6 pt-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2 shrink-0">
                <button
                    type="button"
                    onClick={() => setActiveTab("TICKET")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "TICKET"
                            ? "border-violet-600 text-violet-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <ConfirmationNumberOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Vé & Suất chiếu</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("PAYMENT")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "PAYMENT"
                            ? "border-violet-600 text-violet-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Thanh toán & Khách hàng</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("HISTORY")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition cursor-pointer ${
                        activeTab === "HISTORY"
                            ? "border-violet-600 text-violet-600 bg-white rounded-t-xl"
                            : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                >
                    <HistoryOutlinedIcon sx={{ fontSize: 17 }} />
                    <span>Lịch sử xử lý ({booking.history?.length || 0})</span>
                </button>
            </div>

            {/* Modal Body Content */}
            <DialogContent sx={{ p: 3 }} className="overflow-y-auto space-y-5">
                {/* TAB 1: THÔNG TIN VÉ & SUẤT CHIẾU */}
                {activeTab === "TICKET" && (
                    <div className="space-y-4">
                        {/* 1.1 Ticket Code Banner with Barcode / QR Visual */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                            <div>
                                <span className="text-[11px] font-semibold tracking-wider uppercase text-violet-300">
                                    Mã vé điện tử CineMeow
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-mono text-xl sm:text-2xl font-black tracking-widest text-white">
                                        {booking.ticketCode}
                                    </span>
                                    <Tooltip title={copied ? "Đã sao chép!" : "Sao chép mã vé"} arrow>
                                        <button
                                            type="button"
                                            onClick={handleCopyTicketCode}
                                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                                        >
                                            <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
                                        </button>
                                    </Tooltip>
                                </div>
                                <p className="text-xs text-slate-300 mt-1">
                                    Dùng mã này để quét trực tiếp tại cửa soát vé hoặc in vé tại quầy Kiosk
                                </p>
                            </div>

                            {/* Ticket Mock QR / Barcode */}
                            <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl backdrop-blur-xs shrink-0 border border-white/15">
                                <QrCode2OutlinedIcon sx={{ fontSize: 48 }} className="text-violet-200" />
                                <div className="border-l border-white/20 pl-3">
                                    <div className="text-[10px] text-violet-300 uppercase font-bold">
                                        Trạng thái vào rạp
                                    </div>
                                    <div className="text-xs font-black text-white mt-0.5">
                                        {booking.orderStatus === "CHECKED_IN"
                                            ? "ĐÃ CHECK-IN"
                                            : booking.orderStatus === "PAID"
                                            ? "HỢP LỆ - CHƯA VÀO"
                                            : "CHƯA KHẢ DỤNG"}
                                    </div>
                                    {booking.checkedInAt && (
                                        <div className="text-[10px] text-slate-300">
                                            {dayjs(booking.checkedInAt).format("HH:mm - DD/MM")}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 1.2 Movie & Showtime Details Card */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col md:flex-row gap-4">
                            {/* Poster */}
                            <img
                                src={booking.movie?.poster}
                                alt={booking.movie?.title}
                                className="w-24 h-36 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0"
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "https://placehold.co/160x228/6366f1/ffffff?text=CineMeow";
                                }}
                            />

                            {/* Movie Details */}
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 text-[11px] font-black rounded-md bg-rose-600 text-white">
                                        {booking.movie?.rating || "P"}
                                    </span>
                                    <h4 className="text-base font-black text-slate-900 tracking-tight">
                                        {booking.movie?.title}
                                    </h4>
                                    <span className="text-xs text-slate-400 font-medium">
                                        ({booking.movie?.subtitle})
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                                        <span className="text-[11px] font-semibold text-slate-400 block">
                                            Cụm rạp & Phòng chiếu:
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {booking.cinema?.name}
                                        </span>
                                        <div className="text-violet-600 font-semibold text-[11px] mt-0.5">
                                            {booking.cinema?.roomName} ({booking.cinema?.roomType})
                                        </div>
                                    </div>

                                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                                        <span className="text-[11px] font-semibold text-slate-400 block">
                                            Suất chiếu:
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {booking.showtime?.startTime} - {booking.showtime?.endTime}
                                        </span>
                                        <div className="text-slate-600 font-medium text-[11px] mt-0.5">
                                            {dayjs(booking.showtime?.date).format("dddd, DD/MM/YYYY")}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-1 text-xs">
                                    <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 font-bold border border-violet-100">
                                        {booking.showtime?.format}
                                    </span>
                                    <span className="text-slate-400 font-medium">
                                        Thời lượng: {booking.movie?.duration} phút
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 1.3 Seats Information Grid */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <TheatersOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                    <span>Danh sách ghế đã đặt ({booking.seats?.length} ghế)</span>
                                </h5>
                                <span className="text-xs font-black text-slate-900">
                                    Tổng tiền ghế: {formatCurrency(booking.ticketAmount)}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2.5">
                                {booking.seats?.map((seat, idx) => (
                                    <div
                                        key={idx}
                                        className="px-3.5 py-2 rounded-xl bg-violet-50/70 border border-violet-200/80 flex items-center gap-3 shadow-2xs"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-violet-600 text-white font-mono font-black text-sm flex items-center justify-center shadow-xs">
                                            {seat.code}
                                        </div>
                                        <div>
                                            <div className="text-xs font-black text-slate-800">
                                                Ghế {seat.type}
                                            </div>
                                            <div className="text-[11px] font-bold text-violet-700">
                                                {formatCurrency(seat.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 1.4 F&B Combos (if any) */}
                        {booking.fnbItems && booking.fnbItems.length > 0 && (
                            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                        <FastfoodOutlinedIcon sx={{ fontSize: 16 }} className="text-amber-500" />
                                        <span>Bắp nước & Combo đi kèm ({booking.fnbItems.length} món)</span>
                                    </h5>
                                    <span className="text-xs font-black text-slate-900">
                                        Tổng tiền F&B: {formatCurrency(booking.fnbAmount)}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    {booking.fnbItems.map((fnb, idx) => (
                                        <div
                                            key={idx}
                                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[11px]">
                                                    {fnb.quantity}x
                                                </span>
                                                <span className="font-bold text-slate-800">
                                                    {fnb.name}
                                                </span>
                                            </div>
                                            <span className="font-extrabold text-slate-700">
                                                {formatCurrency(fnb.price * fnb.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: THANH TOÁN & KHÁCH HÀNG */}
                {activeTab === "PAYMENT" && (
                    <div className="space-y-4">
                        {/* 2.1 Customer Profile Info - Synchronized with User Management */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <PersonOutlineOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                <span>Thông tin khách hàng thành viên</span>
                            </h5>

                            {/* Header Profile Card with Avatar & Tier Badge */}
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                    {/* Gradient Avatar */}
                                    <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                                        {customerInitials}
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white bg-emerald-500" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base font-black text-slate-900 leading-snug truncate">
                                                {booking.customer?.name}
                                            </h3>
                                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded shrink-0">
                                                {booking.customer?.membershipCode || "MEM-GUEST"}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium mt-1 truncate">
                                            {booking.customer?.phone} • {booking.customer?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Tier Badge */}
                                <div
                                    className="px-3 py-1.5 rounded-xl border text-xs font-extrabold flex items-center gap-1.5 shrink-0 shadow-2xs"
                                    style={{
                                        backgroundColor: customerTier.bgColor,
                                        color: customerTier.color,
                                        borderColor: customerTier.borderColor,
                                        height: "fit-content",
                                    }}
                                >
                                    <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
                                    <span>{customerTier.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2.2 Payment Breakdown Receipt */}
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <ReceiptLongOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                <span>Chi tiết chi phí & Khấu trừ</span>
                            </h5>

                            <div className="space-y-2 text-xs divide-y divide-slate-100">
                                <div className="flex justify-between py-1.5 text-slate-600">
                                    <span>Tiền vé xem phim ({booking.seats?.length} ghế):</span>
                                    <span className="font-bold text-slate-800">
                                        {formatCurrency(booking.ticketAmount)}
                                    </span>
                                </div>

                                <div className="flex justify-between py-1.5 text-slate-600">
                                    <span>Bắp nước & Dịch vụ đi kèm:</span>
                                    <span className="font-bold text-slate-800">
                                        {formatCurrency(booking.fnbAmount)}
                                    </span>
                                </div>

                                {booking.discountAmount > 0 && (
                                    <div className="flex justify-between py-1.5 text-emerald-600 font-medium">
                                        <span>
                                            Giảm giá Voucher ({booking.voucherCode || "Khuyến mãi"}):
                                        </span>
                                        <span className="font-black">
                                            -{formatCurrency(booking.discountAmount)}
                                        </span>
                                    </div>
                                )}

                                {booking.pointsUsed > 0 && (
                                    <div className="flex justify-between py-1.5 text-violet-600 font-medium">
                                        <span>Điểm thưởng CinePoints đã dùng:</span>
                                        <span className="font-black">
                                            -{formatCurrency(booking.pointsUsed)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between pt-3 text-sm font-black text-slate-900 border-t border-slate-200">
                                    <span>Tổng số tiền thanh toán cuối cùng:</span>
                                    <span className="text-base text-violet-700">
                                        {formatCurrency(booking.totalAmount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 2.3 Payment Gateway & Transaction Info */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                            <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 16 }} className="text-blue-600" />
                                <span>Cổng giao dịch & Đối soát</span>
                            </h5>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-white border border-slate-200/60 space-y-1">
                                    <span className="text-[11px] text-slate-400 font-semibold block">
                                        Phương thức thanh toán:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-0.5 rounded-lg text-xs font-black border ${paymentMethodConfig.bgLight}`}
                                        >
                                            {paymentMethodConfig.shortLabel}
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {paymentMethodConfig.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-slate-200/60 space-y-1 font-mono">
                                    <span className="text-[11px] text-slate-400 font-semibold block font-sans">
                                        Mã giao dịch đối soát (Transaction ID):
                                    </span>
                                    <span className="font-black text-slate-800 text-xs">
                                        {booking.transactionId || "Chưa phát sinh"}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-slate-200/60 space-y-1">
                                    <span className="text-[11px] text-slate-400 font-semibold block">
                                        Thời gian khớp lệnh thanh toán:
                                    </span>
                                    <span className="font-bold text-slate-800">
                                        {booking.paidAt
                                            ? dayjs(booking.paidAt).format("HH:mm:ss - DD/MM/YYYY")
                                            : "Chưa thanh toán"}
                                    </span>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-slate-200/60 space-y-1">
                                    <span className="text-[11px] text-slate-400 font-semibold block">
                                        Trạng thái cổng thanh toán:
                                    </span>
                                    <span className="font-extrabold text-emerald-700 flex items-center gap-1">
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 15 }} />
                                        {booking.paymentStatus === "PAID"
                                            ? "Giao dịch thành công (IPN Verified)"
                                            : booking.paymentStatus === "REFUNDED"
                                            ? "Đã hoàn trả về ví/thẻ"
                                            : booking.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: LỊCH SỬ XỬ LÝ & NHẬT KÝ HỆ THỐNG */}
                {activeTab === "HISTORY" && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                                    <HistoryOutlinedIcon sx={{ fontSize: 16 }} className="text-violet-600" />
                                    <span>Nhật ký hành trình đơn vé ({booking.history?.length || 0} mốc)</span>
                                </h5>
                                <span className="text-[11px] text-slate-400 font-medium">
                                    Ghi nhận tự động từ CineMeow Core Event Bus
                                </span>
                            </div>

                            {/* Timeline Stepper */}
                            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {booking.history?.map((step, idx) => {
                                    const isDone = true;
                                    return (
                                        <div key={idx} className="relative">
                                            {/* Dot */}
                                            <div
                                                className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                                                    step.status === "CHECKED_IN"
                                                        ? "bg-violet-600"
                                                        : step.status === "PAID"
                                                        ? "bg-emerald-500"
                                                        : step.status === "REFUNDED"
                                                        ? "bg-sky-500"
                                                        : step.status === "CANCELLED"
                                                        ? "bg-rose-500"
                                                        : "bg-amber-400"
                                                }`}
                                            />

                                            {/* Step Card */}
                                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <span className="text-xs font-black text-slate-900">
                                                        {step.action}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        {dayjs(step.timestamp).format("HH:mm:ss - DD/MM/YYYY")}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2 text-[11px]">
                                                    <span className="font-semibold text-slate-500">
                                                        Thực hiện bởi:
                                                    </span>
                                                    <span className="font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md border border-violet-100">
                                                        {step.actor}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                    {step.notes}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>

            {/* Modal Footer with Actions */}
            <DialogActions
                sx={{
                    p: 2.5,
                    px: 3,
                    borderTop: "1px solid #F1F5F9",
                    backgroundColor: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <Button
                    variant="outlined"
                    onClick={onClose}
                    sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "12px",
                        borderRadius: "12px",
                        borderColor: "#E2E8F0",
                        color: "#64748B",
                        "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                    }}
                >
                    Đóng cửa sổ
                </Button>

                <div className="flex items-center gap-2">
                    {/* Resend ticket info (SMS/Email) */}
                    {(booking.orderStatus === "PAID" || booking.orderStatus === "CHECKED_IN") && (
                        <Button
                            variant="outlined"
                            onClick={() => onResendTicket(booking)}
                            startIcon={<MailOutlineOutlinedIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                borderRadius: "12px",
                                borderColor: "#E2E8F0",
                                color: "#475569",
                                "&:hover": { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
                            }}
                        >
                            Gửi lại vé điện tử
                        </Button>
                    )}

                    {/* Refund button */}
                    {(booking.orderStatus === "PAID" || booking.orderStatus === "CHECKED_IN") && (
                        <Button
                            variant="outlined"
                            onClick={() => onRefund(booking)}
                            startIcon={<CurrencyExchangeOutlinedIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                fontSize: "12px",
                                borderRadius: "12px",
                                borderColor: "#FECDD3",
                                color: "#E11D48",
                                "&:hover": { borderColor: "#FDA4AF", backgroundColor: "#FFF1F2" },
                            }}
                        >
                            Hủy & Hoàn tiền
                        </Button>
                    )}

                    {/* Check-in / Print Ticket Action */}
                    {booking.orderStatus === "PAID" && (
                        <Button
                            variant="contained"
                            onClick={() => onCheckIn(booking)}
                            startIcon={<PrintOutlinedIcon sx={{ fontSize: 16 }} />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 800,
                                fontSize: "12px",
                                borderRadius: "12px",
                                background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)",
                                boxShadow: "0 10px 20px -5px rgba(124, 58, 237, 0.3)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)",
                                },
                            }}
                        >
                            In vé & Check-in ngay
                        </Button>
                    )}
                </div>
            </DialogActions>
        </Dialog>
    );
}
