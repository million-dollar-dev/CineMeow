package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.request.CinemaRequest;
import com.cinemeow.cinema_service.dto.response.CinemaDetailResponse;

import java.util.List;

public interface CinemaService {
    CinemaDetailResponse create(CinemaRequest request);
    List<CinemaDetailResponse> getAll();
    CinemaDetailResponse getDetailInfo(String id);
    CinemaDetailResponse updateInfo(String id, CinemaRequest request);
    void delete(String id);
}
