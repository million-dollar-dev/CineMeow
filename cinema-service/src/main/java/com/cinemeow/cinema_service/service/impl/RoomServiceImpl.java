package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.RoomMapper;
import com.cinemeow.cinema_service.repository.RoomRepository;
import com.cinemeow.cinema_service.service.CinemaService;
import com.cinemeow.cinema_service.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomServiceImpl implements RoomService {
    RoomRepository roomRepository;
    RoomMapper roomMapper;
    CinemaService cinemaService;

    @Override
    public RoomResponse create(RoomRequest request) {
        var room = roomMapper.toRoom(request);
        var cinema = cinemaService.getCinemaById(request.getCinemaId());
        room.setCinema(cinema);
        roomRepository.save(room);
        return roomMapper.toCinemaRoomResponse(room);
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
}
