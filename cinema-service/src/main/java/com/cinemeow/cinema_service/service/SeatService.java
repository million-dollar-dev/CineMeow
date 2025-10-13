package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.response.SeatResponse;

import java.util.List;

public interface SeatService {
    SeatResponse getSeatById(Long id);
    List<SeatResponse> checkAvailableSeats(List<Long> seatIds);
    void lockSeats(List<Long> seatIds);
    void unlockSeats(List<Long> seatIds);
    void confirmSeats(List<Long> seatIds);
}
