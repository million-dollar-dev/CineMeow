package com.cinemeow.cinema_service.mapper;

import com.cinemeow.cinema_service.dto.request.SeatRequest;
import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.entity.Seat;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SeatMapper {
    Seat toSeat(SeatRequest request);
    SeatResponse toSeatResponse(Seat seat);
    @Mapping(target = "room", ignore = true)
    void update(@MappingTarget Seat seat, SeatRequest request);
}
