package com.cinemeow.booking_service.service;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.response.BookingDetailResponse;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.dto.response.PagedResponse;
import com.cinemeow.booking_service.enums.BookingStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookingService {
    BookingResponse create(BookingRequest request);
    List<BookingResponse> getAll();
    BookingDetailResponse getById(String id);
    PagedResponse<List<BookingDetailResponse>> searchBookings(Pageable pageable, String[] filters);
    BookingResponse update(String id, BookingRequest bookingRequest);
    void delete(String id);
    void updateStatus(String id, BookingStatus status);
    void updatePaymentId(String bookingId, String paymentId);
    void confirmBooking(String bookingId);
//    void cancelBooking(String bookingId);
}
