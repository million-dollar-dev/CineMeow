package com.cinemeow.showtime_service.service;

import com.cinemeow.showtime_service.entity.ShowtimeSeat;

import java.util.List;

public interface ShowtimeSeatService {
    void initializeSeatsForShowtime(String showtimeId, String roomId);
    List<ShowtimeSeat> checkAvailableSeats(List<Long> seatIds);
    void lockSeats(List<Long> seatIds);
    void unlockSeats(List<Long> seatIds);
    void confirmSeats(List<Long> seatIds);
    List<ShowtimeSeat> getSeatsByShowtimeId(String showtimeId);
}
