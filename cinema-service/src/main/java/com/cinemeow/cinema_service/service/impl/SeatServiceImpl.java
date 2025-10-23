package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.SeatMapper;
import com.cinemeow.cinema_service.repository.SeatRepository;
import com.cinemeow.cinema_service.service.SeatService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SeatServiceImpl implements SeatService {
    SeatRepository seatRepository;
    SeatMapper seatMapper;

    @Override
    public SeatResponse getSeatById(Long id) {
        var seat = seatRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SEAT_NOT_AVAILABLE));
        return null;
    }

    @Override
    public List<SeatResponse> checkAvailableSeats(List<Long> seatIds) {
        return seatRepository.findByIdInAndStatus(seatIds, SeatStatus.ACTIVE)
                .stream()
                .map(seatMapper::toSeatResponse)
                .toList();
    }

    @Transactional
    @Override
    public void lockSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllByIdIn(seatIds);
        for (Seat seat : seats) {
            if (seat.getStatus() != SeatStatus.AVAILABLE) {
                throw new AppException(ErrorCode.SEAT_NOT_AVAILABLE);
            }
            seat.setStatus(SeatStatus.LOCKED);
        }
        seatRepository.saveAll(seats);
    }

    @Override
    public void unlockSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllByIdIn(seatIds);
        for (Seat seat : seats) {
            if (seat.getStatus() == SeatStatus.LOCKED) {
                seat.setStatus(SeatStatus.AVAILABLE);
            }
        }
        seatRepository.saveAll(seats);
    }

    @Override
    public void confirmSeats(List<Long> seatIds) {
        List<Seat> seats = seatRepository.findAllByIdIn(seatIds);
        for (Seat seat : seats) {
            if (seat.getStatus() != SeatStatus.LOCKED) {
                throw new AppException(ErrorCode.SEAT_NOT_LOCKED);
            }
            seat.setStatus(SeatStatus.BOOKED);
        }
        seatRepository.saveAll(seats);
    }
}
