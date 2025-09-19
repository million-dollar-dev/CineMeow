package com.cinemeow.cinema_service.mapper;

import com.cinemeow.cinema_service.dto.request.SeatRequest;
import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.entity.Seat;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    Seat toSeat(SeatRequest request);
    SeatResponse toSeatResponse(Seat seat);
}
