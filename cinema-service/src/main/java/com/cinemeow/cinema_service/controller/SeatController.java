package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.service.SeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/seats")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatController {
    SeatService seatService;

    @GetMapping("/{id}")
    public SeatResponse getSeatById(@PathVariable Long id) {
        return seatService.getSeatById(id);
    }

    @PostMapping("/check")
    public List<SeatResponse> checkAvailableSeats(@RequestBody List<Long> seatIds) {
        return seatService.checkAvailableSeats(seatIds);
    }

    @PostMapping("/lock")
    public void lockSeats(@RequestBody List<Long> seatIds) {
        seatService.lockSeats(seatIds);
    }

    @PostMapping("/confirm")
    public void confirmSeats(@RequestBody List<Long> seatIds) {
        seatService.confirmSeats(seatIds);
    }

    @PostMapping("/unlock")
    public void unlockSeats(@RequestBody List<Long> seatIds) {
        seatService.unlockSeats(seatIds);
    }

}
