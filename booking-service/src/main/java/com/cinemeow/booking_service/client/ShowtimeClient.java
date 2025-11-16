package com.cinemeow.booking_service.client;

import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.ShowtimeResponse;
import com.cinemeow.booking_service.entity.ShowtimeSeat;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@FeignClient(
        name = "showtime-service",
        url = "${app.services.showtime-service}"
)
public interface ShowtimeClient {
    @GetMapping("/showtimes/{id}")
    BaseResponse<ShowtimeResponse> getById(@PathVariable("id") String id);

    @GetMapping("/showtimes/{id}/seats")
    BaseResponse<List<ShowtimeSeat>> getSeats(@PathVariable String id);

    @PostMapping("/seats/check")
    List<ShowtimeSeat> checkAvailableSeats(@RequestBody List<Long> seatIds);

    @PostMapping("/seats/lock")
    void lockSeats(@RequestBody List<Long> seatIds);

    @PostMapping("/seats/confirm")
    void confirmSeats(@RequestBody List<Long> seatIds);

    @PostMapping("/seats/unlock")
    void unlockSeats(@RequestBody List<Long> seatIds);

}
