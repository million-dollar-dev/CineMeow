package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import com.cinemeow.cinema_service.service.RoomService;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.entity.ShowtimeSeat;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.repository.ShowtimeSeatRepository;
import com.cinemeow.showtime_service.service.ShowtimeSeatService;
import com.cinemeow.showtime_service.validator.SeatGapValidator;
import com.cinemeow.showtime_service.validator.SeatPosition;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowtimeSeatServiceImpl implements ShowtimeSeatService {
    ShowtimeSeatRepository showtimeSeatRepository;
    ShowtimeRepository showtimeRepository;
    RoomService roomService;
    SeatGapValidator seatGapValidator;

    @Override
    public void initializeSeatsForShowtime(String showtimeId, String roomId) {
        List<SeatResponse> seats = roomService.getSeatMap(roomId).getSeats();
        List<ShowtimeSeat> showtimeSeats = seats.stream()
                .filter(seat -> seat.getType() != SeatType.EMPTY)
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
    public List<ShowtimeSeat> checkAvailableSeats(String showtimeId, List<Long> seatIds) {
        List<ShowtimeSeat> availableSeats = showtimeSeatRepository.findBySeatIdInAndStatusAndShowtimeId(seatIds,
                        SeatStatus.AVAILABLE, showtimeId)
                .stream()
                .toList();

        if (availableSeats.size() == seatIds.size()) {
            validateSeatGap(showtimeId, seatIds);
        }

        return availableSeats;
    }

    @Transactional
    @Override
    public void lockSeats(List<Long> seatIds) {
        List<ShowtimeSeat> seats = showtimeSeatRepository.findAllByIdIn(seatIds);
        for (ShowtimeSeat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
        }

        if (!seats.isEmpty()) {
            String showtimeId = seats.get(0).getShowtimeId();
            List<Long> physicalSeatIds = seats.stream().map(ShowtimeSeat::getSeatId).toList();
            validateSeatGap(showtimeId, physicalSeatIds);
        }

        for (ShowtimeSeat seat : seats) {
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

    private void validateSeatGap(String showtimeId, List<Long> physicalSeatIds) {
        if (showtimeId == null || physicalSeatIds == null || physicalSeatIds.isEmpty()) {
            return;
        }

        Showtime showtime = showtimeRepository.findById(showtimeId).orElse(null);
        if (showtime == null || showtime.getRoomId() == null) {
            return;
        }

        List<SeatResponse> roomSeats = roomService.getSeatMap(showtime.getRoomId()).getSeats();
        if (roomSeats == null || roomSeats.isEmpty()) {
            return;
        }

        List<ShowtimeSeat> allShowtimeSeats = showtimeSeatRepository.findAllByShowtimeId(showtimeId);
        Map<Long, SeatStatus> statusMap = allShowtimeSeats.stream()
                .filter(s -> s.getSeatId() != null)
                .collect(Collectors.toMap(ShowtimeSeat::getSeatId, ShowtimeSeat::getStatus, (s1, s2) -> s1));

        List<SeatPosition> positions = roomSeats.stream()
                .map(s -> SeatPosition.builder()
                        .seatId(s.getId())
                        .label(s.getLabel())
                        .rowIndex(s.getRowIndex())
                        .colIndex(s.getColIndex())
                        .type(s.getType())
                        .status(statusMap.getOrDefault(s.getId(), s.getStatus()))
                        .build())
                .collect(Collectors.toList());

        seatGapValidator.validate(positions, new HashSet<>(physicalSeatIds));
    }
}

