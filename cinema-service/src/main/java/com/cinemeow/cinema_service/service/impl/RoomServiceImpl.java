package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.request.SeatMapRequest;
import com.cinemeow.cinema_service.dto.request.SeatRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.dto.response.SeatMapResponse;
import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.entity.Room;
import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.RoomMapper;
import com.cinemeow.cinema_service.mapper.SeatMapper;
import com.cinemeow.cinema_service.repository.RoomRepository;
import com.cinemeow.cinema_service.repository.SeatRepository;
import com.cinemeow.cinema_service.service.CinemaService;
import com.cinemeow.cinema_service.service.RoomService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomServiceImpl implements RoomService {
    RoomRepository roomRepository;

    SeatRepository seatRepository;

    RoomMapper roomMapper;

    SeatMapper seatMapper;

    CinemaService cinemaService;

    @Override
    @Caching(evict = {
            @CacheEvict(value = "rooms", key = "'all'"),
            @CacheEvict(value = "roomWithBrand", key = "#id")
    })
    public RoomResponse create(RoomRequest request) {
        var room = roomMapper.toRoom(request);
        var cinema = cinemaService.getCinemaById(request.getCinemaId());
        room.setCinema(cinema);
        roomRepository.save(room);
        var response = roomMapper.toCinemaRoomResponse(room);
        response.setCinemaId(cinema.getId());
        response.setName(cinema.getName());
        return response;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "rooms", key = "'all'"),
            @CacheEvict(value = "room", key = "#id"),
            @CacheEvict(value = "roomWithBrand", key = "#id")
    })
    public RoomResponse update(String id, RoomRequest request) {
        var room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        roomMapper.update(room, request);
        roomRepository.save(room);
        return roomMapper.toCinemaRoomResponse(room);
    }

    @Override
    @Cacheable(value = "room", key = "#id")
    public RoomResponse getById(String id) {
        var room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        var response = roomMapper.toCinemaRoomResponse(room);
        var cinema = room.getCinema();
        response.setCinemaId(cinema.getId());
        response.setCinemaName(cinema.getName());
        response.setCinemaAddress(cinema.getAddress());
        response.setBrandId(cinema.getBrand().getId());
        response.setBrandName(cinema.getBrand().getName());
        return response;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "rooms", key = "'all'"),
            @CacheEvict(value = "room", key = "#id"),
            @CacheEvict(value = "roomWithBrand", key = "#id")
    })
    public void delete(String id) {
        roomRepository.deleteById(id);
    }


    @Override
    @Caching(evict = {
            @CacheEvict(value = "rooms", key = "'all'"),
            @CacheEvict(value = "room", key = "#cinemaId"),
            @CacheEvict(value = "roomWithBrand", key = "#cinemaId")
    })
    public List<RoomResponse> getRoomsByCinemaId(String cinemaId) {
        return roomRepository.getRoomsByCinemaId(cinemaId)
                .stream()
                .map(roomMapper::toCinemaRoomResponse)
                .toList();
    }

    @Override
    public SeatMapResponse createSeatMap(String roomId, SeatMapRequest request) {
        var room =  roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        for (SeatRequest seatRequest : request.getSeats()) {
            var aSeat = seatMapper.toSeat(seatRequest);
            aSeat.setRoom(room);
            room.getSeats().add(aSeat);
        }

        assignSeatLabels(room);

        roomRepository.save(room);

        return toSeatMapResponse(room);
    }

    @Override
    @Cacheable(value = "roomSeatMap", key = "#id")
    public SeatMapResponse getSeatMap(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        return toSeatMapResponse(room);
    }

    @Transactional
    @Override
    @CacheEvict(value = "roomSeatMap", key = "#id")
    public SeatMapResponse updateSeatMap(String roomId, SeatMapRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        Map<Long, Seat> existingSeats = seatRepository.findAllByRoomId(roomId)
                .stream()
                .collect(Collectors.toMap(Seat::getId, s -> s));

        // Update or create new seats
        for (SeatRequest s : request.getSeats()) {
            if (s.getSeatId() != null && existingSeats.containsKey(s.getSeatId())) {
                Seat seat = existingSeats.get(s.getSeatId());
                seatMapper.update(seat, s);
                log.info("Seat with id " + s.getSeatId() + " has been updated");
            } else {
                Seat newSeat = new Seat();
                newSeat.setRowIndex(s.getRowIndex());
                newSeat.setColIndex(s.getColIndex());
                newSeat.setType(s.getType());
                newSeat.setStatus(s.getStatus());
                newSeat.setRoom(room);
                room.getSeats().add(newSeat);
                log.info("add new Seat");
            }
        }

        // Soft delete seats not included
        Set<Long> requestSeatIds = request.getSeats().stream()
                .map(SeatRequest::getSeatId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        for (Seat seat : existingSeats.values()) {
            if (!requestSeatIds.contains(seat.getId())) {
                seat.setStatus(SeatStatus.DELETED);
            }
        }

        assignSeatLabels(room);

        roomRepository.save(room);

        return toSeatMapResponse(room);
    }

    private void assignSeatLabels(Room room) {
        List<Seat> seats = room.getSeats()
                .stream()
                .filter(seat -> seat.getStatus() != SeatStatus.DELETED)
                .sorted(Comparator.comparingInt(Seat::getRowIndex)
                        .thenComparingInt(Seat::getColIndex))
                .collect(Collectors.toList());

        Map<Integer, List<Seat>> seatsByRow = seats.stream()
                .collect(Collectors.groupingBy(Seat::getRowIndex, LinkedHashMap::new, Collectors.toList()));

        int logicalRow = 0;
        for (Map.Entry<Integer, List<Seat>> entry : seatsByRow.entrySet()) {
            List<Seat> rowSeats = entry.getValue();

            boolean hasNonEmpty = rowSeats.stream().anyMatch(s -> s.getType() != SeatType.EMPTY);
            if (!hasNonEmpty) continue;

            String rowLabel = getRowLetter(logicalRow++);
            int seatNumber = 0;

            for (Seat seat : rowSeats) {
                if (seat.getType() == SeatType.EMPTY) {
                    seat.setLabel(null);
                } else {
                    seatNumber++;
                    seat.setLabel(rowLabel + seatNumber);
                }
            }
        }
    }

    private String getRowLetter(int index) {
        StringBuilder label = new StringBuilder();
        while (index >= 0) {
            label.insert(0, (char) ('A' + (index % 26)));
            index = (index / 26) - 1;
        }
        return label.toString();
    }

    private SeatMapResponse toSeatMapResponse(Room room) {
        return SeatMapResponse.from(room);
    }
}
