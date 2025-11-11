package com.cinemeow.cinema_service.service.impl;

import com.cinemeow.cinema_service.dto.request.CinemaBrandRequest;
import com.cinemeow.cinema_service.dto.response.CinemaBrandResponse;
import com.cinemeow.cinema_service.entity.CinemaBrand;
import com.cinemeow.cinema_service.exception.AppException;
import com.cinemeow.cinema_service.exception.ErrorCode;
import com.cinemeow.cinema_service.mapper.CinemaBrandMapper;
import com.cinemeow.cinema_service.repository.CinemaBrandRepository;
import com.cinemeow.cinema_service.service.CinemaBrandService;
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
public class CinemaBrandServiceImpl implements CinemaBrandService {
    CinemaBrandRepository cinemaBrandRepository;
    CinemaBrandMapper cinemaBrandMapper;

    @Override
    @CacheEvict(value = "brands", key = "'all'")
    public CinemaBrandResponse create(CinemaBrandRequest request) {
        var brand = cinemaBrandMapper.toCinemaBrand(request);
        cinemaBrandRepository.save(brand);
        return cinemaBrandMapper.toCinemaBrandResponse(brand);
    }

    @Override
    @Cacheable(value = "brands", key = "'all'")
    public List<CinemaBrandResponse> getAll() {
        return cinemaBrandRepository.findAll()
                .stream()
                .map(cinemaBrandMapper::toCinemaBrandResponse)
                .toList();
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "brands", key = "'all'"),
            @CacheEvict(value = "brand", key = "#id")
    })
    public CinemaBrandResponse updateById(String id, CinemaBrandRequest request) {
        var brand = cinemaBrandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
        cinemaBrandMapper.update(brand, request);
        cinemaBrandRepository.save(brand);
        return cinemaBrandMapper.toCinemaBrandResponse(brand);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "brands", key = "'all'"),
            @CacheEvict(value = "brand", key = "#id")
    })
    public void delete(String id) {
        cinemaBrandRepository.deleteById(id);
    }

    @Override
    @Cacheable(value = "brand", key = "#id")
    public CinemaBrandResponse getById(String id) {
        return cinemaBrandMapper.toCinemaBrandResponse(this.findById(id));
    }

    @Override
    public CinemaBrand findById(String id) {
        return cinemaBrandRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_EXISTED));
    }
}
