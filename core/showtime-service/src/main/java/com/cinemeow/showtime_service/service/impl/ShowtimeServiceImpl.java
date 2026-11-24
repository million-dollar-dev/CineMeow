package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.service.RoomService;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.service.MovieService;
import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.enums.ShowtimeStatus;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.showtime_service.mapper.ShowtimeMapper;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.repository.specification.ShowtimeSpecificationBuilder;
import com.cinemeow.showtime_service.service.ShowtimeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ShowtimeServiceImpl implements ShowtimeService {
    ShowtimeRepository showtimeRepository;

    ShowtimeMapper showtimeMapper;

    MovieService movieService;

    RoomService roomService;

    @NonFinal
    @Value("${app.showtime.transition-buffer-minutes:15}")
    int defaultBufferMinutes = 15;

    private int getEffectiveBufferMinutes(ShowtimeRequest request) {
        if (request.getTransitionBufferMinutes() != null && request.getTransitionBufferMinutes() > 0) {
            return request.getTransitionBufferMinutes();
        }
        return defaultBufferMinutes;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "showtimes", allEntries = true),
            @CacheEvict(value = "showtime_search", allEntries = true)
    })
    @Transactional
    public ShowtimeResponse create(ShowtimeRequest request) {
        int bufferMinutes = getEffectiveBufferMinutes(request);
        LocalDateTime effectiveEndTime = request.getEndTime().plusMinutes(bufferMinutes);

        // Layer 1: Application-level check
        Optional<Showtime> conflict = showtimeRepository.findConflictingShowtime(
                request.getRoomId(),
                request.getStartTime(),
                effectiveEndTime,
                ShowtimeStatus.CANCELLED.name(),
                null
        );
        if (conflict.isPresent()) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        var showtime = showtimeMapper.toShowtime(request);
        showtime.setTransitionBufferMinutes(bufferMinutes);
        showtime.setEffectiveEndTime(effectiveEndTime);

        // Layer 2: Save to DB (PostgreSQL Exclusion Constraint protects against concurrent race conditions)
        try {
            showtimeRepository.save(showtime);
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        var response = buildFullShowtimeResponse(showtime);
        return response;
    }

    @Override
    @Cacheable(value = "showtimes", key = "'all'")
    public List<ShowtimeResponse> getAll() {
        return showtimeRepository.findAll().stream()
                .map(this::buildFullShowtimeResponse)
                .toList();
    }

    @Override
    @Cacheable(value = "showtime", key = "#id")
    public ShowtimeResponse getById(String id) {
        Showtime showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXISTED));

        var response = buildFullShowtimeResponse(showtime);
        return response;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "showtimes", allEntries = true),
            @CacheEvict(value = "showtime_search", allEntries = true),
            @CacheEvict(value = "showtime", key = "#id")
    })
    @Transactional
    public ShowtimeResponse updateById(String id, ShowtimeRequest request) {
        var showtime = showtimeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SHOWTIME_NOT_EXISTED));

        int bufferMinutes = getEffectiveBufferMinutes(request);
        LocalDateTime effectiveEndTime = request.getEndTime().plusMinutes(bufferMinutes);

        // Layer 1: Application-level check (excluding current showtime id)
        Optional<Showtime> conflict = showtimeRepository.findConflictingShowtime(
                request.getRoomId(),
                request.getStartTime(),
                effectiveEndTime,
                ShowtimeStatus.CANCELLED.name(),
                id
        );
        if (conflict.isPresent()) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        showtimeMapper.update(showtime, request);
        showtime.setTransitionBufferMinutes(bufferMinutes);
        showtime.setEffectiveEndTime(effectiveEndTime);

        try {
            showtimeRepository.save(showtime);
        } catch (DataIntegrityViolationException ex) {
            throw new AppException(ErrorCode.SHOWTIME_OVERLAPPED);
        }

        var response = buildFullShowtimeResponse(showtime);
        return response;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "showtimes", allEntries = true),
            @CacheEvict(value = "showtime_search", allEntries = true),
            @CacheEvict(value = "showtime", key = "#id")
    })
    public void delete(String id) {
        showtimeRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = "showtime_search", key = "#pageable.pageNumber + ':' + #pageable.pageSize + ':' + T(java.util.Arrays).toString(#filters)")
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

        MovieResponse movie = movieService.getById(showtime.getMovieId());
        response.setMovieTitle(movie.getTitle());
        response.setPosterPath(movie.getPosterPath());

        RoomResponse room = roomService.getById(showtime.getRoomId());
        response.setRoomName(room.getName());
        response.setCinemaId(room.getCinemaId());
        response.setCinemaName(room.getCinemaName());
        response.setCinemaAddress(room.getCinemaAddress());
        response.setBrandId(room.getBrandId());
        response.setBrandName(room.getBrandName());
        response.setRoomType(room.getType());
        response.setTransitionBufferMinutes(showtime.getTransitionBufferMinutes());
        response.setEffectiveEndTime(showtime.getEffectiveEndTime());

        return response;
    }
}
