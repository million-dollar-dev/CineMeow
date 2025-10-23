package com.cinemeow.booking_service.mapper;

import com.cinemeow.booking_service.dto.request.BookingRequest;
import com.cinemeow.booking_service.dto.response.BookingResponse;
import com.cinemeow.booking_service.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(target = "seats", ignore = true)
    @Mapping(target = "fnbItems", ignore = true)
    Booking toBooking(BookingRequest request);

    BookingResponse toBookingResponse(Booking booking);
}
