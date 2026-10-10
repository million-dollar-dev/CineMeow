// Booking & Ticket Order Constants for CineMeow Admin System

export const BOOKING_STORAGE_KEY = "cinemeow_booking_orders_storage_v1";

// 1. Booking / Order Statuses
export const BOOKING_STATUSES = {
    PAID: {
        value: "PAID",
        label: "Đã thanh toán",
        color: "emerald",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        dotColor: "bg-emerald-500",
        description: "Giao dịch hoàn tất, vé điện tử đã được phát hành",
    },
    CHECKED_IN: {
        value: "CHECKED_IN",
        label: "Đã check-in",
        color: "purple",
        badgeBg: "bg-violet-50 text-violet-700 border-violet-200",
        dotColor: "bg-violet-500",
        description: "Khách hàng đã in vé / quét mã vào phòng chiếu",
    },
    PENDING: {
        value: "PENDING",
        label: "Chờ thanh toán",
        color: "amber",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        dotColor: "bg-amber-500",
        description: "Đang giữ ghế tạm thời trong thời gian đếm ngược",
    },
    CANCELLED: {
        value: "CANCELLED",
        label: "Đã hủy",
        color: "slate",
        badgeBg: "bg-slate-100 text-slate-700 border-slate-200",
        dotColor: "bg-slate-400",
        description: "Đơn hàng bị hủy do hết hạn giữ chỗ hoặc người dùng hủy",
    },
    REFUNDED: {
        value: "REFUNDED",
        label: "Đã hoàn tiền",
        color: "blue",
        badgeBg: "bg-sky-50 text-sky-700 border-sky-200",
        dotColor: "bg-sky-500",
        description: "Đơn vé đã được hoàn tiền lại cho khách hàng",
    },
};

// 1.1 StatusChip Configurations (Standardized for system StatusChip component)
export const BOOKING_STATUS_CONFIG = {
    PAID: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/80",
        dot: "bg-emerald-500",
        pulse: true,
        label: "Đã thanh toán",
    },
    CHECKED_IN: {
        bg: "bg-violet-50",
        text: "text-violet-700",
        border: "border-violet-200/80",
        dot: "bg-violet-500",
        pulse: false,
        label: "Đã check-in",
    },
    PENDING: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/80",
        dot: "bg-amber-500",
        pulse: false,
        label: "Chờ thanh toán",
    },
    REFUNDED: {
        bg: "bg-sky-50",
        text: "text-sky-700",
        border: "border-sky-200/80",
        dot: "bg-sky-500",
        pulse: false,
        label: "Đã hoàn tiền",
    },
    CANCELLED: {
        bg: "bg-slate-100",
        text: "text-slate-700",
        border: "border-slate-200",
        dot: "bg-slate-400",
        pulse: false,
        label: "Đã hủy",
    },
};

// 2. Payment Methods
export const PAYMENT_METHODS = {
    VNPAY: {
        value: "VNPAY",
        label: "VNPAY-QR / Thẻ ATM",
        shortLabel: "VNPAY",
        color: "#005BAA",
        bgLight: "bg-blue-50 text-blue-700 border-blue-200",
    },
    MOMO: {
        value: "MOMO",
        label: "Ví điện tử MoMo",
        shortLabel: "MoMo",
        color: "#A50064",
        bgLight: "bg-pink-50 text-pink-700 border-pink-200",
    },
    ZALOPAY: {
        value: "ZALOPAY",
        label: "Ví ZaloPay",
        shortLabel: "ZaloPay",
        color: "#0068FF",
        bgLight: "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    CREDIT_CARD: {
        value: "CREDIT_CARD",
        label: "Thẻ Visa / Mastercard",
        shortLabel: "Visa/Master",
        color: "#1A1F71",
        bgLight: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    CASH: {
        value: "CASH",
        label: "Tiền mặt tại quầy",
        shortLabel: "Tiền mặt",
        color: "#10B981",
        bgLight: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
};

// 3. Quick Status Filter Tabs
export const BOOKING_QUICK_TABS = [
    { value: "ALL", label: "Tất cả đơn" },
    { value: "PAID", label: "Đã thanh toán" },
    { value: "CHECKED_IN", label: "Đã check-in" },
    { value: "PENDING", label: "Chờ thanh toán" },
    { value: "REFUNDED", label: "Đã hoàn tiền" },
    { value: "CANCELLED", label: "Đã hủy" },
];

// 4. Sort Options
export const BOOKING_SORT_OPTIONS = [
    { value: "NEWEST", label: "Thời gian: Mới nhất" },
    { value: "OLDEST", label: "Thời gian: Cũ nhất" },
    { value: "AMOUNT_DESC", label: "Giá trị đơn: Cao nhất" },
    { value: "AMOUNT_ASC", label: "Giá trị đơn: Thấp nhất" },
];

// 5. Cinema Branch Filter Options
export const CINEMA_BRANCH_FILTERS = [
    { value: "ALL", label: "Tất cả cụm rạp" },
    { value: "CineMeow Landmark 81", label: "CineMeow Landmark 81 (TP.HCM)" },
    { value: "CineMeow Royal City", label: "CineMeow Royal City (Hà Nội)" },
    { value: "CineMeow Thảo Điền", label: "CineMeow Thảo Điền (TP.HCM)" },
    { value: "CineMeow Tây Sơn", label: "CineMeow Tây Sơn (Hà Nội)" },
    { value: "CineMeow Vincom Đà Nẵng", label: "CineMeow Vincom (Đà Nẵng)" },
];
