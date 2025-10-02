
export const SHOWTIME_STATUS = {
    AVAILABLE: "AVAILABLE",   // còn bán vé
    SOLD_OUT: "SOLD_OUT",     // hết vé
    CANCELLED: "CANCELLED",   // hủy suất chiếu
    FINISHED: "FINISHED",     // đã kết thúc
};

// Nếu muốn dùng cho select hiển thị label:
export const SHOWTIME_STATUS_OPTIONS = [
    { value: SHOWTIME_STATUS.AVAILABLE, label: "Còn vé" },
    { value: SHOWTIME_STATUS.SOLD_OUT, label: "Hết vé" },
    { value: SHOWTIME_STATUS.CANCELLED, label: "Hủy suất chiếu" },
    { value: SHOWTIME_STATUS.FINISHED, label: "Đã kết thúc" },
];
