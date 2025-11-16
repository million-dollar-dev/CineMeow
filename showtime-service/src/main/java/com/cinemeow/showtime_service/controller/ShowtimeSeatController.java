package com.cinemeow.showtime_service.controller;

import com.cinemeow.showtime_service.entity.ShowtimeSeat;
import com.cinemeow.showtime_service.service.ShowtimeSeatService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/seats")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatController {
    ShowtimeSeatService showtimeSeatService;

    @PostMapping("/check")
    public List<ShowtimeSeat> checkAvailableSeats(@RequestBody List<Long> seatIds) {
        return showtimeSeatService.checkAvailableSeats(seatIds);
    }

    @PostMapping("/lock")
    public void lockSeats(@RequestBody List<Long> seatIds) {
        showtimeSeatService.lockSeats(seatIds);
    }

    @PostMapping("/confirm")
    public void confirmSeats(@RequestBody List<Long> seatIds) {
        showtimeSeatService.confirmSeats(seatIds);
    }

    @PostMapping("/unlock")
    public void unlockSeats(@RequestBody List<Long> seatIds) {
        showtimeSeatService.unlockSeats(seatIds);
    }

}
