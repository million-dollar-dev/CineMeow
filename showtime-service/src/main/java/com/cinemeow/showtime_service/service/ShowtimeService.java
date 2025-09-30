package com.cinemeow.showtime_service.service;

import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ShowtimeService {
    ShowtimeResponse create(ShowtimeRequest request);
    List<ShowtimeResponse> getAll();
    ShowtimeResponse getById(String id);
    ShowtimeResponse updateById(String id, ShowtimeRequest request);
    void delete(String id);
    List<ShowtimeResponse> searchShowtime(String[] filters);
}
