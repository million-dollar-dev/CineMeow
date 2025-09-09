package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.request.CinemaBrandRequest;
import com.cinemeow.cinema_service.dto.response.CinemaBrandResponse;
import com.cinemeow.cinema_service.entity.CinemaBrand;

import java.util.List;

public interface CinemaBrandService {
    CinemaBrandResponse create(CinemaBrandRequest request);
    List<CinemaBrandResponse> getAll();
    CinemaBrandResponse updateById(String id, CinemaBrandRequest request);
    void delete(String id);
    CinemaBrand findById(String id);
}
