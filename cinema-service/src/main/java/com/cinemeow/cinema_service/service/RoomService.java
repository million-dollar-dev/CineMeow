package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;

import java.util.List;

public interface RoomService {
    RoomResponse create(RoomRequest request);
    RoomResponse update(String id, RoomRequest request);
    RoomResponse getById(String id);
    void delete(String id);
    List<RoomResponse> getRoomsByCinemaId(String cinemaId);
}
