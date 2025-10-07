package com.cinemeow.booking_service.mapper;

import com.cinemeow.booking_service.dto.request.TicketPriceRequest;
import com.cinemeow.booking_service.dto.response.TicketPriceResponse;
import com.cinemeow.booking_service.entity.TicketPrice;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TicketPriceMapper {
    TicketPrice toTicketPrice(TicketPriceRequest request);
    TicketPriceResponse toTicketPriceResponse(TicketPrice ticketPrice);
    void update(@MappingTarget TicketPrice ticketPrice, TicketPriceRequest request);
}
