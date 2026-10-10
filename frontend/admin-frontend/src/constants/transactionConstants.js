// Payment Transaction Management Constants for CineMeow Admin System

export const TRANSACTION_STORAGE_KEY = "cinemeow_admin_transactions_storage_v1";

// 1. Transaction Statuses
export const TRANSACTION_STATUSES = {
    SUCCESS: {
        value: "SUCCESS",
        label: "Thành công",
        color: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        description: "Giao dịch đã quyết toán thành công qua cổng thanh toán",
    },
    PENDING: {
        value: "PENDING",
        label: "Đang xử lý",
        color: "amber",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        description: "Đang chờ khách xác nhận hoặc cổng xử lý IPN Webhook",
    },
    FAILED: {
        value: "FAILED",
        label: "Thất bại",
        color: "rose",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        dotColor: "bg-rose-500",
        description: "Giao dịch bị từ chối, hết hạn hoặc tài khoản không đủ số dư",
    },
    REFUNDED: {
        value: "REFUNDED",
        label: "Đã hoàn tiền",
        color: "purple",
        badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
        dotColor: "bg-violet-500",
        description: "Giao dịch đã được hoàn lại tiền về tài khoản nguồn hoặc ví",
    },
    CANCELLED: {
        value: "CANCELLED",
        label: "Đã hủy",
        color: "slate",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        dotColor: "bg-slate-400",
        description: "Khách hàng hủy giao dịch tại màn hình thanh toán",
    },
};

// 1.1 StatusChip Configurations (Integrated with StatusChip.jsx)
export const TRANSACTION_STATUS_CONFIG = {
    SUCCESS: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/80",
        dot: "bg-emerald-500",
        pulse: true,
        label: "Thành công",
    },
    PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/80",
        dot: "bg-amber-500",
        pulse: true,
        label: "Đang xử lý",
    },
    FAILED: {
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200/80",
        dot: "bg-rose-500",
        pulse: false,
        label: "Thất bại",
    },
    REFUNDED: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200/80",
        dot: "bg-violet-500",
        pulse: false,
        label: "Đã hoàn tiền",
    },
    CANCELLED: {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200/80",
        dot: "bg-slate-400",
        pulse: false,
        label: "Đã hủy",
    },
};

// 2. Transaction Types
export const TRANSACTION_TYPES = {
    ALL: {
        value: "ALL",
        label: "Tất cả phân loại",
    },
    PAYMENT: {
        value: "PAYMENT",
        label: "Thanh toán vé / Combo",
        shortLabel: "Thanh toán",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        sign: "+",
    },
    REFUND: {
        value: "REFUND",
        label: "Hoàn tiền hủy vé",
        shortLabel: "Hoàn tiền",
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        sign: "-",
    },
    TOPUP: {
        value: "TOPUP",
        label: "Nạp ví CinePoints",
        shortLabel: "Nạp điểm",
        badgeClass: "bg-violet-50 text-violet-700 border-violet-200",
        sign: "+",
    },
};

// 3. Payment Gateways & Channels
export const PAYMENT_GATEWAYS = {
    ALL: {
        value: "ALL",
        label: "Tất cả cổng thanh toán",
    },
    VNPAY: {
        value: "VNPAY",
        label: "VNPay QR",
        shortLabel: "VNPay",
        brandColor: "#005BAA",
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    },
    MOMO: {
        value: "MOMO",
        label: "Ví Điện Tử MoMo",
        shortLabel: "MoMo",
        brandColor: "#A50064",
        badgeClass: "bg-pink-50 text-pink-700 border-pink-200",
    },
    ZALOPAY: {
        value: "ZALOPAY",
        label: "ZaloPay",
        shortLabel: "ZaloPay",
        brandColor: "#0068FF",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    },
    SHOPEEPAY: {
        value: "SHOPEEPAY",
        label: "ShopeePay",
        shortLabel: "ShopeePay",
        brandColor: "#EE4D2D",
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200",
    },
    VIETQR: {
        value: "VIETQR",
        label: "Chuyển khoản VietQR",
        shortLabel: "VietQR",
        brandColor: "#007A33",
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    VISA_MASTER: {
        value: "VISA_MASTER",
        label: "Thẻ Quốc Tế (Visa/Master)",
        shortLabel: "Visa/Master",
        brandColor: "#1A1F71",
        badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    CASH: {
        value: "CASH",
        label: "Tiền mặt tại quầy (POS)",
        shortLabel: "Tiền mặt",
        brandColor: "#475569",
        badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    },
};

// 4. Quick Status Filter Tabs
export const TRANSACTION_QUICK_TABS = [
    { value: "ALL", label: "Tất cả giao dịch" },
    { value: "SUCCESS", label: "Thành công" },
    { value: "PENDING", label: "Đang xử lý" },
    { value: "REFUNDED", label: "Đã hoàn tiền" },
    { value: "FAILED", label: "Thất bại" },
];

// 5. Sort Options
export const TRANSACTION_SORT_OPTIONS = [
    { value: "NEWEST", label: "Thời gian (Mới nhất)" },
    { value: "OLDEST", label: "Thời gian (Cũ nhất)" },
    { value: "AMOUNT_DESC", label: "Số tiền (Cao nhất)" },
    { value: "AMOUNT_ASC", label: "Số tiền (Thấp nhất)" },
];
