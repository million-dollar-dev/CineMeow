package com.cinemeow.showtime_service.client;

import com.cinemeow.showtime_service.dto.response.BaseResponse;
import com.cinemeow.showtime_service.dto.response.RoomResponse;
import com.cinemeow.showtime_service.dto.response.SeatMapResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "cinema-service",
        url = "${app.services.cinema-service}"
)
public interface CinemaClient {
    @GetMapping("/rooms/{id}")
    BaseResponse<RoomResponse> getById(@PathVariable String id);

    @GetMapping("/rooms/{id}/seats")
    BaseResponse<SeatMapResponse> getSeatMap(@PathVariable String id);
}
