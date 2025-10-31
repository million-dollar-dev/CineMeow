package com.cinemeow.booking_service.controller;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.BookingDetailResponse;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.enums.BookingStatus;
import com.cinemeow.booking_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/bookings")
public class BookingController {
    BookingService bookingService;

    @PostMapping
    public BaseResponse<BookingResponse> create(@Valid @RequestBody BookingRequest request){
        return BaseResponse.<BookingResponse>builder()
                .data(bookingService.create(request))
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<BookingDetailResponse> get(@PathVariable String id){
        return BaseResponse.<BookingDetailResponse>builder()
                .data(bookingService.getById(id))
                .build();
    }

    @PutMapping("/{id}/status")
    public void updateStatus(@PathVariable String id, @RequestBody BookingStatus status) {
        bookingService.updateStatus(id, status);
    }

    @PutMapping("/{id}/payment")
    public void updatePayment(@PathVariable String id, @RequestBody String paymentId) {
        bookingService.updatePaymentId(id, paymentId);
    }

    @PostMapping("/{id}/confirm")
    public void confirmBooking(@PathVariable String id) {
        bookingService.confirmBooking(id);
    }
}
