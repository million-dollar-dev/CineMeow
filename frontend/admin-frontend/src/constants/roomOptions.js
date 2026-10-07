export const ROOM_TYPES = [
    { value: "_2D", label: "2D Standard", badge: "2D", color: "slate" },
    { value: "_3D", label: "3D Digital", badge: "3D", color: "sky" },
    { value: "_IMAX", label: "IMAX Laser", badge: "IMAX", color: "purple" },
    { value: "_4DX", label: "4DX Motion", badge: "4DX", color: "indigo" },
];

export const ROOM_STATUSES = [
    { value: "ACTIVE", label: "Đang hoạt động", dot: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" },
    { value: "MAINTENANCE", label: "Bảo trì / Sửa chữa", dot: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
    { value: "INACTIVE", label: "Tạm ngưng hoạt động", dot: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
];

export const getRoomTypeLabel = (value) => {
    if (!value) return "2D Standard";
    const clean = String(value).replace(/^_/, "");
    const found = ROOM_TYPES.find(
        (item) => item.value === value || item.value === `_${clean}` || item.badge === clean
    );
    return found?.label || clean;
};

export const getRoomStatusLabel = (value) =>
    ROOM_STATUSES.find((item) => item.value === value)?.label || value || "Chưa xác định";