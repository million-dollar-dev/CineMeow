package com.cinemeow.showtime_service.mapper;

import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.entity.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ShowtimeMapper {
    Showtime toShowtime(ShowtimeRequest request);
    ShowtimeResponse toShowtimeResponse(Showtime showtime);
    void update(@MappingTarget Showtime showtime, ShowtimeRequest request);
}
