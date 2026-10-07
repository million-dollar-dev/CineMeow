// Mock and Configuration for Ticket Pricing in CineMeow Admin

export const ROOM_FORMAT_CONFIG = {
    _2D: {
        value: "_2D",
        label: "2D Standard",
        shortLabel: "2D",
        badge: "Chuẩn 2D",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        pillColor: "bg-blue-500",
        description: "Định dạng chiếu kỹ thuật số tiêu chuẩn, sắc nét và thông dụng nhất.",
    },
    _3D: {
        value: "_3D",
        label: "3D Digital",
        shortLabel: "3D",
        badge: "Không Gian 3D",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        pillColor: "bg-emerald-500",
        description: "Hình ảnh nổi ba chiều chiều sâu chân thực kèm kính lọc phân cực chuyên dụng.",
    },
    _IMAX: {
        value: "_IMAX",
        label: "IMAX Laser",
        shortLabel: "IMAX",
        badge: "Màn Hình Cực Đại",
        badgeColor: "bg-violet-50 text-violet-700 border-violet-200",
        pillColor: "bg-violet-600",
        description: "Màn hình cong khổng lồ tràn viền, máy chiếu Laser 4K đôi và âm thanh vòm 12 kênh.",
    },
    _4DX: {
        value: "_4DX",
        label: "4DX Motion",
        shortLabel: "4DX",
        badge: "Hiệu Ứng Đa Giác Quan",
        badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
        pillColor: "bg-rose-500",
        description: "Ghế chuyển động đa hướng đồng bộ hành động phim cùng hiệu ứng gió, nước, mùi hương.",
    },
};

export const SEAT_TYPE_CONFIG = {
    NORMAL: {
        value: "NORMAL",
        label: "Ghế Đơn Tiêu Chuẩn",
        shortLabel: "Ghế Đơn",
        sublabel: "1 Khách",
        description: "Ghế bọc đệm êm ái với tay vịn riêng và khoảng để chân thoải mái.",
        color: "text-slate-700 bg-slate-100 border-slate-200",
    },
    COUPLE: {
        value: "COUPLE",
        label: "Ghế Đôi Sweetbox",
        shortLabel: "Ghế Đôi",
        sublabel: "2 Khách",
        description: "Ghế sofa đôi rộng rãi không vách ngăn, không gian riêng tư cho cặp đôi.",
        color: "text-rose-700 bg-rose-50 border-rose-200",
    },
};

export const ROOM_TYPES = ["_2D", "_3D", "_IMAX", "_4DX"];
export const SEAT_TYPES = ["NORMAL", "COUPLE"];

// Default Pricing Matrix Template per brand
export const DEFAULT_BRAND_PRICING = [
    { roomType: "_2D", seatType: "NORMAL", price: 85000 },
    { roomType: "_2D", seatType: "COUPLE", price: 180000 },
    { roomType: "_3D", seatType: "NORMAL", price: 120000 },
    { roomType: "_3D", seatType: "COUPLE", price: 250000 },
    { roomType: "_IMAX", seatType: "NORMAL", price: 190000 },
    { roomType: "_IMAX", seatType: "COUPLE", price: 390000 },
    { roomType: "_4DX", seatType: "NORMAL", price: 210000 },
    { roomType: "_4DX", seatType: "COUPLE", price: 420000 },
];

// Presets for Quick 1-Click Application
export const PRICING_PRESETS = [
    {
        name: "Phổ Thông (Tiêu Chuẩn)",
        description: "Phù hợp hệ thống rạp trung tâm thông thường",
        values: {
            _2D: { NORMAL: 80000, COUPLE: 170000 },
            _3D: { NORMAL: 110000, COUPLE: 230000 },
            _IMAX: { NORMAL: 180000, COUPLE: 370000 },
            _4DX: { NORMAL: 200000, COUPLE: 410000 },
        },
    },
    {
        name: "Cao Cấp (Flagship Mall)",
        description: "Dành cho các cụm rạp tại TTTM hạng A",
        values: {
            _2D: { NORMAL: 95000, COUPLE: 200000 },
            _3D: { NORMAL: 130000, COUPLE: 270000 },
            _IMAX: { NORMAL: 210000, COUPLE: 430000 },
            _4DX: { NORMAL: 230000, COUPLE: 470000 },
        },
    },
    {
        name: "Ưu Đãi Học Sinh - Sinh Viên",
        description: "Chính sách giá hỗ trợ kích cầu giới trẻ",
        values: {
            _2D: { NORMAL: 65000, COUPLE: 140000 },
            _3D: { NORMAL: 90000, COUPLE: 190000 },
            _IMAX: { NORMAL: 150000, COUPLE: 310000 },
            _4DX: { NORMAL: 170000, COUPLE: 350000 },
        },
    },
];

// Helper to normalize price list into a 2D structured matrix
export const formatPricingMatrix = (rawList = [], brandId = "") => {
    return ROOM_TYPES.map((roomType) => ({
        roomType,
        config: ROOM_FORMAT_CONFIG[roomType],
        seats: SEAT_TYPES.map((seatType) => {
            const found = rawList.find(
                (p) => p.roomType === roomType && p.seatType === seatType
            );
            const defaultItem = DEFAULT_BRAND_PRICING.find(
                (p) => p.roomType === roomType && p.seatType === seatType
            );
            return {
                id: found?.id || null,
                brandId: brandId || found?.brandId,
                roomType,
                seatType,
                seatConfig: SEAT_TYPE_CONFIG[seatType],
                price: found?.price !== undefined ? Number(found.price) : (defaultItem?.price || 0),
            };
        }),
    }));
};
