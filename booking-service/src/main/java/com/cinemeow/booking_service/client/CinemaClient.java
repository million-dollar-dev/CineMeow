package com.cinemeow.booking_service.client;

import com.cinemeow.booking_service.dto.request.CalculatePriceRequest;
import com.cinemeow.booking_service.dto.response.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@FeignClient(
        name = "cinema-service",
        url = "${app.services.cinema-service}"
)
public interface CinemaClient {
    @GetMapping("/rooms/{id}")
    BaseResponse<RoomResponse> getById(@PathVariable String id);

    @GetMapping("/brands")
    BaseResponse<List<CinemaBrandResponse>> getAll();

    @GetMapping("/brands/{id}")
    BaseResponse<CinemaBrandResponse> getBrandById(@PathVariable String id);

    @GetMapping("/seats/{id}")
    SeatResponse getSeatById(@PathVariable Long id);

    @PostMapping("/seats/check")
    List<SeatResponse> checkAvailableSeats(@RequestBody List<Long> seatIds);

    @PostMapping("seats/confirm")
    void confirmSeats(@RequestBody List<Long> seatIds);

    @PostMapping("/fnbs/internal/calculate")
    BigDecimal calculate(Map<String, Integer> items);
}
