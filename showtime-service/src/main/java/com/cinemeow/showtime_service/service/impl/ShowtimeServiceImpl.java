package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.exception.AppException;
import com.cinemeow.showtime_service.exception.ErrorCode;
import com.cinemeow.showtime_service.mapper.ShowtimeMapper;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.service.ShowtimeService;
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
public class ShowtimeServiceImpl implements ShowtimeService {
    ShowtimeRepository showtimeRepository;
    ShowtimeMapper showtimeMapper;

    @Override
    public ShowtimeResponse create(ShowtimeRequest request) {
        var showtime = showtimeMapper.toShowtime(request);
        showtimeRepository.save(showtime);
        var response = buildFullShowtimeResponse(showtime);
        return response;
    }

    @Override
    public List<ShowtimeResponse> getAll() {
        return showtimeRepository.findAll().stream()
                .map(this::buildFullShowtimeResponse)
                .toList();
    }

    @Override
    public ShowtimeResponse getById(String id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXISTED));

        var response = buildFullShowtimeResponse(showtime);
        return response;
    }


    @Override
    public ShowtimeResponse updateById(String id, ShowtimeRequest request) {
        var showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXISTED));
        showtimeMapper.update(showtime, request);
        showtimeRepository.save(showtime);
        var response = buildFullShowtimeResponse(showtime);
        return response;
    }

    @Override
    public void delete(String id) {
        showtimeRepository.deleteById(id);
    }

    private ShowtimeResponse buildFullShowtimeResponse(Showtime showtime) {
        ShowtimeResponse response = showtimeMapper.toShowtimeResponse(showtime);
        return response;
    }

}
