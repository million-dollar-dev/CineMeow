package com.cinemeow.cinema_service.mapper;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.entity.Room;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    @Mapping(target = "cinema", ignore = true)
    Room toRoom(RoomRequest request);

    RoomResponse toCinemaRoomResponse(Room room);

    @Mapping(target = "cinema", ignore = true)
    void update(@MappingTarget Room room, RoomRequest request);
}
