export const PROMOTION_STATUS_CONFIG = {
    ACTIVE: {
        label: "Kích hoạt",
        color: "success",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200/80",
        dot: "bg-emerald-500",
        badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        dotColor: "bg-emerald-500",
        pulse: true,
    },
    INACTIVE: {
        label: "Chưa kích hoạt",
        color: "warning",
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200/80",
        dot: "bg-amber-500",
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
        dotColor: "bg-amber-500",
        pulse: false,
    },
    EXPIRED: {
        label: "Đã hết hạn",
        color: "error",
        bg: "bg-rose-50",
        text: "text-rose-700",
        border: "border-rose-200/80",
        dot: "bg-rose-500",
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200/80",
        dotColor: "bg-rose-500",
        pulse: false,
    },
};

export const PROMOTION_STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Kích hoạt" },
    { value: "INACTIVE", label: "Chưa kích hoạt" },
    { value: "EXPIRED", label: "Đã hết hạn" },
];

export const PROMOTION_TYPES = [
    { label: "Giảm theo phần trăm (%)", value: "PERCENTAGE", unit: "%", icon: "％" },
    { label: "Giảm số tiền cố định (VNĐ)", value: "FIXED_AMOUNT", unit: "₫", icon: "₫" },
    { label: "Ưu đãi Combo Bắp Nước", value: "FNB_DISCOUNT", unit: "₫", icon: "🍿" },
    { label: "Ưu đãi Vé Xem Phim", value: "TICKET_DISCOUNT", unit: "₫", icon: "🎟️" },
];

export const CONDITION_TYPES = [
    { label: "Loại ghế áp dụng", value: "SEAT_TYPE", placeholder: "VD: VIP, COUPLE, STANDARD" },
    { label: "Định dạng phòng", value: "ROOM_TYPE", placeholder: "VD: 2D, 3D, IMAX, 4DX" },
    { label: "Thương hiệu rạp", value: "BRAND", placeholder: "VD: CGV, LOTTE, CINEMEOW" },
    { label: "Phương thức thanh toán", value: "PAYMENT_METHOD", placeholder: "VD: VNPAY, MOMO, ZALOPAY" },
    { label: "Ngày trong tuần", value: "DAY_OF_WEEK", placeholder: "VD: WEEKEND, WEDNESDAY" },
    { label: "Khung giờ áp dụng", value: "TIME_RANGE", placeholder: "VD: 18:00 - 22:00" },
    { label: "Hạng thành viên", value: "USER_TYPE", placeholder: "VD: MEMBER, VIP, STUDENT" },
];