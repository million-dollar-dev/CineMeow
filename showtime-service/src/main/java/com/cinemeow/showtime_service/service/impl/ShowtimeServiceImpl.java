package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.showtime_service.client.CinemaClient;
import com.cinemeow.showtime_service.client.MovieClient;
import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.MovieResponse;
import com.cinemeow.showtime_service.dto.response.RoomResponse;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.exception.AppException;
import com.cinemeow.showtime_service.exception.ErrorCode;
import com.cinemeow.showtime_service.mapper.ShowtimeMapper;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.repository.specification.ShowtimeSpecificationBuilder;
import com.cinemeow.showtime_service.service.ShowtimeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ShowtimeServiceImpl implements ShowtimeService {
    ShowtimeRepository showtimeRepository;

    ShowtimeMapper showtimeMapper;

    MovieClient movieClient;

    CinemaClient cinemaClient;

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

    @Override
    public List<ShowtimeResponse> searchShowtime(Pageable pageable, String[] filters) {
        log.info("Search params: {}", Arrays.toString(filters));
        Page<Showtime> showtimePage;
        if (filters != null && filters.length > 0) {
            ShowtimeSpecificationBuilder builder = new ShowtimeSpecificationBuilder();

            Pattern pattern = Pattern.compile("(\\w+?)([:<>~!])(\\p{Punct})(.*)(\\p{Punct})");
            for (String filter : filters) {
                Matcher matcher = pattern.matcher(filter);

                if (matcher.find()) {
                    String key = matcher.group(1);
                    String operation = matcher.group(2);
                    String prefix = matcher.group(3);
                    String value = matcher.group(4);
                    String suffix = matcher.group(5);
                    if (value.isEmpty()) {
                        log.warn("Empty value in filter: {}", filter);
                        continue;
                    }
                    builder.with(null, key, operation, value, prefix, suffix);
                } else {
                    log.warn("Invalid filter format: {}", filter);
                }
            }
            Specification<Showtime> spec = builder.build();
            showtimePage = showtimeRepository.findAll(spec, pageable);
        } else {
            showtimePage = showtimeRepository.findAll(pageable);
        }

        return showtimePage.stream()
                .map(this::buildFullShowtimeResponse)
                .toList();
    }

    private ShowtimeResponse buildFullShowtimeResponse(Showtime showtime) {
        ShowtimeResponse response = showtimeMapper.toShowtimeResponse(showtime);

        MovieResponse movie = movieClient.getById(showtime.getMovieId()).getData();
        response.setMovieTitle(movie.getTitle());
        response.setPosterPath(movie.getPosterPath());

        RoomResponse room = cinemaClient.getById(showtime.getRoomId()).getData();
        response.setRoomName(room.getName());
        response.setCinemaId(room.getCinemaId());
        response.setCinemaName(room.getCinemaName());
        response.setCinemaAddress(room.getCinemaAddress());
        response.setBrandId(room.getBrandId());
        response.setBrandName(room.getBrandName());

        return response;
    }

}
