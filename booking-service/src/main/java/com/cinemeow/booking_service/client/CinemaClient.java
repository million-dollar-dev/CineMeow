package com.cinemeow.booking_service.client;

import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.CinemaBrandResponse;
import com.cinemeow.booking_service.dto.response.SeatResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "cinema-service",
        url = "${app.services.cinema-service}"
)
public interface CinemaClient {
    @GetMapping("/brands/{id}")
    BaseResponse<CinemaBrandResponse> getBrandById(@PathVariable String id);

    @GetMapping("/brands")
    BaseResponse<List<CinemaBrandResponse>> getAll();

    @PostMapping("/seats/check")
    List<SeatResponse> checkAvailableSeats(@RequestBody List<Long> seatIds);
}
