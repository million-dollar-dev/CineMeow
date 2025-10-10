package com.cinemeow.booking_service.service;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse create(BookingRequest request);
    List<BookingResponse> getAll();
    List<BookingResponse> getById(String id);
    BookingResponse update(String id, BookingRequest bookingRequest);
    void delete(String id);
}
