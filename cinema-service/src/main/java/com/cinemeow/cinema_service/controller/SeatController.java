package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.service.SeatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/seats")
public class SeatController {
    SeatService seatService;

    @PostMapping("/seats")
    public List<SeatResponse> getAvailableSeats(@RequestBody List<Long> seatIds) {
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
