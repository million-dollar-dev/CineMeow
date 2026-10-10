// CineMeow Notification Constants & Configurations

export const NOTIFICATION_STORAGE_KEY = "cinemeow_admin_notifications";

export const NOTIFICATION_CATEGORIES = {
    BOOKING: {
        code: "BOOKING",
        label: "Đơn Vé & Đặt Chỗ",
        shortLabel: "Vé & Đơn",
        color: "#7C3AED", // Violet
        bgColor: "#F5F3FF",
        borderColor: "#DDD6FE",
        iconBg: "bg-violet-100 text-violet-700",
        targetRoute: "/dashboard",
    },
    SHOWTIME: {
        code: "SHOWTIME",
        label: "Lịch Chiếu & Phòng",
        shortLabel: "Suất Chiếu",
        color: "#0284C7", // Sky
        bgColor: "#F0F9FF",
        borderColor: "#BAE6FD",
        iconBg: "bg-sky-100 text-sky-700",
        targetRoute: "/showtimes",
    },
    INVENTORY: {
        code: "INVENTORY",
        label: "Kho Bắp Nước F&B",
        shortLabel: "Kho F&B",
        color: "#D97706", // Amber
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        iconBg: "bg-amber-100 text-amber-700",
        targetRoute: "/fnb",
    },
    REVENUE: {
        code: "REVENUE",
        label: "Doanh Thu & Đối Soát",
        shortLabel: "Doanh Thu",
        color: "#059669", // Emerald
        bgColor: "#ECFDF5",
        borderColor: "#A7F3D0",
        iconBg: "bg-emerald-100 text-emerald-700",
        targetRoute: "/dashboard",
    },
    PROMOTION: {
        code: "PROMOTION",
        label: "Ưu Đãi & Voucher",
        shortLabel: "Khuyến Mãi",
        color: "#E11D48", // Rose
        bgColor: "#FFF1F2",
        borderColor: "#FECDD3",
        iconBg: "bg-rose-100 text-rose-700",
        targetRoute: "/promotion",
    },
    SYSTEM: {
        code: "SYSTEM",
        label: "Hệ Thống & Bảo Mật",
        shortLabel: "Hệ Thống",
        color: "#475569", // Slate
        bgColor: "#F8FAFC",
        borderColor: "#E2E8F0",
        iconBg: "bg-slate-100 text-slate-700",
        targetRoute: "/settings",
    },
};

export const NOTIFICATION_PRIORITIES = {
    CRITICAL: {
        code: "CRITICAL",
        label: "Khẩn cấp",
        color: "#DC2626",
        bgColor: "#FEF2F2",
        borderColor: "#FECACA",
        badge: "🔴 Khẩn cấp",
    },
    HIGH: {
        code: "HIGH",
        label: "Quan trọng",
        color: "#D97706",
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        badge: "🟠 Quan trọng",
    },
    NORMAL: {
        code: "NORMAL",
        label: "Bình thường",
        color: "#475569",
        bgColor: "#F8FAFC",
        borderColor: "#E2E8F0",
        badge: "⚪ Thường",
    },
    SUCCESS: {
        code: "SUCCESS",
        label: "Hoàn tất",
        color: "#059669",
        bgColor: "#ECFDF5",
        borderColor: "#A7F3D0",
        badge: "🟢 Thành công",
    },
};
