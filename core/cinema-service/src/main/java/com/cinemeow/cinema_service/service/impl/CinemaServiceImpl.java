package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.CinemaRequest;
import com.cinemeow.cinema_service.dto.response.CinemaDetailResponse;
import com.cinemeow.cinema_service.entity.Cinema;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.CinemaMapper;
import com.cinemeow.cinema_service.repository.CinemaRepository;
import com.cinemeow.cinema_service.service.CinemaBrandService;
import com.cinemeow.cinema_service.service.CinemaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CinemaServiceImpl implements CinemaService {
    CinemaRepository cinemaRepository;
    CinemaMapper cinemaMapper;
    CinemaBrandService brandService;

    @Override
    @Caching(evict = {
            @CacheEvict(value = "cinemas", key = "'all'"),
            @CacheEvict(value = "cinema", key = "#id")
    })
    public CinemaDetailResponse create(CinemaRequest request) {
        var cinema = cinemaMapper.toCinema(request);
        var brand = brandService.findById(request.getBrandId());
        cinema.setBrand(brand);
        cinemaRepository.save(cinema);
        return cinemaMapper.toCinemaDetailResponse(cinema);
    }

    @Override
    @Cacheable(value = "cinemas", key = "'all'")
    public List<CinemaDetailResponse> getAll() {
        return cinemaRepository.findAll()
                .stream()
                .map(cinemaMapper::toCinemaDetailResponse)
                .toList();
    }

    @Override
    @Cacheable(value = "cinema", key = "#id")
    public CinemaDetailResponse getDetailInfo(String id) {
        var cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_EXISTED));
        return cinemaMapper.toCinemaDetailResponse(cinema);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "cinemas", key = "'all'"),
            @CacheEvict(value = "cinema", key = "#id")
    })
    public CinemaDetailResponse updateInfo(String id, CinemaRequest request) {
        var cinema = cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_EXISTED));
        var brand = brandService.findById(request.getBrandId());
        cinema.setBrand(brand);
        cinemaMapper.updateInfo(cinema, request);
        cinemaRepository.save(cinema);
        return cinemaMapper.toCinemaDetailResponse(cinema);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "cinemas", key = "'all'"),
            @CacheEvict(value = "cinema", key = "#id")
    })
    public void delete(String id) {
        cinemaRepository.deleteById(id);
    }

    @Override
    public Cinema getCinemaById(String id) {
        return cinemaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_EXISTED));
    }
}
