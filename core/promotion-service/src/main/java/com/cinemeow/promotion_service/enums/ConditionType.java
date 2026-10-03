package com.cinemeow.promotion_service.enums;

public enum ConditionType {
    SEAT_TYPE,        // Áp dụng theo loại ghế (VIP, COUPLE, STANDARD)
    ROOM_TYPE,        // Áp dụng theo loại phòng (2D, 3D, IMAX)
    BRAND,            // Theo thương hiệu rạp (CGV, LOTTE)
    PAYMENT_METHOD,   // Theo phương thức thanh toán
    DAY_OF_WEEK,      // Áp dụng theo ngày (WEEKDAY, WEEKEND)
    TIME_RANGE,       // Theo khung giờ (ví dụ: 18:00 - 22:00)
    USER_TYPE         // Theo người dùng (GUEST, MEMBER, VIP)
}
