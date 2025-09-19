package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.request.SeatMapRequest;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.dto.response.SeatMapResponse;

import java.util.List;

public interface RoomService {
    RoomResponse create(RoomRequest request);
    RoomResponse update(String id, RoomRequest request);
    RoomResponse getById(String id);
    void delete(String id);
    List<RoomResponse> getRoomsByCinemaId(String cinemaId);
    SeatMapResponse createSeatMap(SeatMapRequest request);
    SeatMapResponse getSeatMap(String id);
    SeatMapResponse updateSeatMap(String roomId, SeatMapRequest request);
}
