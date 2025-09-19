package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.request.SeatMapRequest;
import com.cinemeow.cinema_service.dto.request.SeatRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.dto.response.SeatMapResponse;
import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.entity.Room;
import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.RoomMapper;
import com.cinemeow.cinema_service.mapper.SeatMapper;
import com.cinemeow.cinema_service.repository.RoomRepository;
import com.cinemeow.cinema_service.repository.SeatRepository;
import com.cinemeow.cinema_service.service.CinemaService;
import com.cinemeow.cinema_service.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
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
    public RoomResponse update(String id, RoomRequest request) {
        var room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        roomMapper.update(room, request);
        roomRepository.save(room);
        return roomMapper.toCinemaRoomResponse(room);
    }

    @Override
    public RoomResponse getById(String id) {
        var room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));
        var response = roomMapper.toCinemaRoomResponse(room);
        response.setCinemaId(room.getCinema().getId());
        response.setCinemaName(room.getCinema().getName());
        return response;
    }

    @Override
    public void delete(String id) {
        roomRepository.deleteById(id);
    }


    @Override
    public List<RoomResponse> getRoomsByCinemaId(String cinemaId) {
        return roomRepository.getRoomsByCinemaId(cinemaId)
                .stream()
                .map(roomMapper::toCinemaRoomResponse)
                .toList();
    }

    @Override
    public SeatMapResponse createSeatMap(SeatMapRequest request) {
        var room =  roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        for (SeatRequest seatRequest : request.getSeats()) {
            var aSeat = seatMapper.toSeat(seatRequest);
            room.getSeats().add(aSeat);
        }

        roomRepository.save(room);
        return toSeatMapResponse(room);
    }

    @Override
    public SeatMapResponse getSeatMap(String id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_EXISTED));

        return toSeatMapResponse(room);
    }

    @Override
    public SeatMapResponse updateSeatMap(String roomId, SeatMapRequest request) {
        return null;
    }

    private SeatMapResponse toSeatMapResponse(Room room) {
        return SeatMapResponse.from(room);
    }
}
