package com.cinemeow.booking_service.enums;

public enum BookingStatus {
    PENDING_PAYMENT,   // Đang chờ thanh toán
    PAID,              // Đã thanh toán
    CANCELLED,         // Bị hủy
    EXPIRED,           // Hết hạn thanh toán
    REFUNDED           // Đã hoàn tiền
}

