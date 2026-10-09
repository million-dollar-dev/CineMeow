// CineMeow Admin Account Management Constants & Permissions

export const ACCOUNT_STORAGE_KEY = "cinemeow_admin_accounts";

export const ADMIN_ROLES = {
    SUPER_ADMIN: {
        code: "SUPER_ADMIN",
        label: "Tổng Quản Trị (Super Admin)",
        shortLabel: "Super Admin",
        color: "#7C3AED", // Violet
        bgColor: "#F5F3FF",
        borderColor: "#DDD6FE",
        description: "Toàn quyền quản trị hệ thống, tài khoản, cấu hình app và doanh thu toàn quốc.",
        permissions: ["ALL"],
    },
    CINEMA_MANAGER: {
        code: "CINEMA_MANAGER",
        label: "Quản Lý Cụm Rạp (Branch Manager)",
        shortLabel: "Quản Lý Rạp",
        color: "#0284C7", // Sky
        bgColor: "#F0F9FF",
        borderColor: "#BAE6FD",
        description: "Quản lý suất chiếu, phòng máy, nhân viên quầy và hoạt động tại chi nhánh được phân công.",
        permissions: ["SHOWTIME_MANAGE", "CINEMA_MANAGE", "STAFF_VIEW", "REPORT_BRANCH"],
    },
    OPERATOR: {
        code: "OPERATOR",
        label: "Nhân Viên Vận Hành (Ticket & FnB Staff)",
        shortLabel: "Vận Hành / Bán Vé",
        color: "#059669", // Emerald
        bgColor: "#ECFDF5",
        borderColor: "#A7F3D0",
        description: "Kiểm soát vé mã QR tại sảnh, bán vé tại quầy và xuất combo bắp nước F&B.",
        permissions: ["TICKET_SCAN", "POS_ORDER", "FNB_FULFILL"],
    },
    MARKETING_SPECIALIST: {
        code: "MARKETING_SPECIALIST",
        label: "Chuyên Viên Marketing & Ưu Đãi",
        shortLabel: "Marketing",
        color: "#D97706", // Amber
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        description: "Quản lý danh mục phim, chương trình khuyến mãi, voucher và nội dung thông báo.",
        permissions: ["PROMOTION_MANAGE", "MOVIE_VIEW", "BANNER_MANAGE"],
    },
    FINANCE_AUDITOR: {
        code: "FINANCE_AUDITOR",
        label: "Kiểm Toán & Kế Toán (Auditor)",
        shortLabel: "Tài Chính",
        color: "#4B5563", // Slate
        bgColor: "#F8FAFC",
        borderColor: "#E2E8F0",
        description: "Tra cứu hóa đơn điện tử, đối soát doanh thu cổng thanh toán VNPay, MoMo, ZaloPay.",
        permissions: ["BILLING_VIEW", "INVOICE_AUDIT", "REPORT_FINANCE"],
    },
};

export const ACCOUNT_STATUS_CONFIG = {
    ACTIVE: {
        label: "Đang hoạt động",
        color: "success",
        bgColor: "#ECFDF5",
        textColor: "#047857",
        borderColor: "#A7F3D0",
        dotColor: "#10B981",
    },
    INACTIVE: {
        label: "Tạm ngưng",
        color: "warning",
        bgColor: "#FFFBEB",
        textColor: "#B45309",
        borderColor: "#FDE68A",
        dotColor: "#F59E0B",
    },
    SUSPENDED: {
        label: "Đã đình chỉ",
        color: "error",
        bgColor: "#FEF2F2",
        textColor: "#B91C1C",
        borderColor: "#FECDD3",
        dotColor: "#EF4444",
    },
};

export const CINEMA_BRANCH_OPTIONS = [
    { id: "ALL", name: "Toàn bộ hệ thống (Toàn quốc)" },
    { id: "CNM_LANDMARK", name: "CineMeow Landmark 81 (TP.HCM)" },
    { id: "CNM_THAODIEN", name: "CineMeow Thảo Điền (TP.HCM)" },
    { id: "CNM_TAYHO", name: "CineMeow Tây Hồ (Hà Nội)" },
    { id: "CNM_BAOTANG", name: "CineMeow Tràng Tiền (Hà Nội)" },
    { id: "CNM_DRAGON", name: "CineMeow Sông Hàn (Đà Nẵng)" },
];

export const CUSTOMER_STORAGE_KEY = "cinemeow_customer_accounts";

export const MEMBERSHIP_TIERS = {
    STANDARD: {
        code: "STANDARD",
        label: "Thành viên Thường",
        shortLabel: "Standard",
        color: "#64748B",
        bgColor: "#F1F5F9",
        borderColor: "#CBD5E1",
        badge: "🎟️ Standard",
        discount: "0%",
    },
    SILVER: {
        code: "SILVER",
        label: "Hội viên Bạc (Silver)",
        shortLabel: "Silver",
        color: "#0284C7",
        bgColor: "#F0F9FF",
        borderColor: "#BAE6FD",
        badge: "🥈 Silver",
        discount: "5%",
    },
    GOLD: {
        code: "GOLD",
        label: "Hội viên Vàng (Gold)",
        shortLabel: "Gold",
        color: "#D97706",
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        badge: "🥇 Gold VIP",
        discount: "10%",
    },
    PLATINUM: {
        code: "PLATINUM",
        label: "Hội viên Kim Cương (Platinum)",
        shortLabel: "Platinum",
        color: "#7C3AED",
        bgColor: "#F5F3FF",
        borderColor: "#DDD6FE",
        badge: "💎 Platinum VIP",
        discount: "15%",
    },
};
