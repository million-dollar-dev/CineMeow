package com.cinemeow.booking_service.mapper;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.entity.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    Booking toBooking(BookingRequest request);
}
