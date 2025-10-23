package com.cinemeow.booking_service.controller;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.service.BookingService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
