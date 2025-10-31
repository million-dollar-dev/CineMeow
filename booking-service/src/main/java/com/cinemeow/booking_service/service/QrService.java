package com.cinemeow.booking_service.service;

import com.cinemeow.booking_service.dto.response.BookingDetailResponse;

public interface QrService {
    String generateQRCode(String bookingId);
    String generateQrImage(String qrToken);
    BookingDetailResponse verifyQRCode(String token);
}
