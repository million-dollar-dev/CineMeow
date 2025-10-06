package com.cinemeow.cinema_service.service;

import com.cinemeow.cinema_service.dto.request.FnbItemRequest;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;

import java.util.List;

public interface FnbItemService {
    FnbItemResponse creat(FnbItemRequest request);
    List<FnbItemResponse> getAll();
    FnbItemResponse getById(String id);
    FnbItemResponse updateById(String id, FnbItemRequest request);
    void deleteById(String id);
}
