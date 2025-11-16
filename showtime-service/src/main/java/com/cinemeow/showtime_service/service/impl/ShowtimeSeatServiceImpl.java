package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.showtime_service.client.CinemaClient;
import com.cinemeow.showtime_service.dto.response.SeatResponse;
import com.cinemeow.showtime_service.entity.ShowtimeSeat;
import com.cinemeow.showtime_service.enums.SeatStatus;
import com.cinemeow.showtime_service.enums.SeatType;
import com.cinemeow.showtime_service.exception.AppException;
import com.cinemeow.showtime_service.exception.ErrorCode;
import com.cinemeow.showtime_service.repository.ShowtimeSeatRepository;
import com.cinemeow.showtime_service.service.ShowtimeSeatService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatServiceImpl implements ShowtimeSeatService {
    ShowtimeSeatRepository showtimeSeatRepository;
    CinemaClient cinemaClient;

    @Override
    public void initializeSeatsForShowtime(String showtimeId, String roomId) {
        List<SeatResponse> seats = cinemaClient.getSeatMap(roomId).getData().getSeats();
        List<ShowtimeSeat> showtimeSeats = seats.stream()
                .filter(seat -> seat.getType() != SeatType.EMPTY.EMPTY)
                .map(seat -> ShowtimeSeat.builder()
                        .showtimeId(showtimeId)
                        .seatId(seat.getId())
                        .status(SeatStatus.AVAILABLE)
                        .label(seat.getLabel())
                        .type(seat.getType())
                        .reservedUntil(null)
                        .bookingId(null)
                        .build())
                .collect(Collectors.toList());

        showtimeSeatRepository.saveAll(showtimeSeats);
    }

    @Override
    public List<ShowtimeSeat> checkAvailableSeats(List<Long> seatIds) {
        return showtimeSeatRepository.findByIdInAndStatus(seatIds, SeatStatus.ACTIVE)
                .stream()
                .toList();
    }

    @Transactional
    @Override
    public void lockSeats(List<Long> seatIds) {
        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByIdIn(seatIds);
        for (ShowtimeSeat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
            seat.setStatus(SeatStatus.LOCKED);
        }
        showtimeSeatRepository.saveAll(seats);
    }

    @Override
    public void unlockSeats(List<Long> seatIds) {
        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByIdIn(seatIds);
        for (ShowtimeSeat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED) {
                seat.setStatus(SeatStatus.AVAILABLE);
            }
        }
        showtimeSeatRepository.saveAll(seats);
    }

    @Override
    public void confirmSeats(List<Long> seatIds) {
        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByIdIn(seatIds);
        for (ShowtimeSeat seat : seats) {
//            if (seat.getStatus() != SeatStatus.LOCKED) {
//                throw new AppException(ErrorCode.SEAT_NOT_LOCKED);
//            }
            seat.setStatus(SeatStatus.BOOKED);
        }
        showtimeSeatRepository.saveAll(seats);
    }

    @Override
    public List<ShowtimeSeat> getSeatsByShowtimeId(String showtimeId) {
        return showtimeSeatRepository.findAllByShowtimeId(showtimeId);
    }
}
