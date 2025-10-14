package com.cinemeow.promotion_service.service;

import com.cinemeow.promotion_service.dto.request.PromotionRequest;
import com.cinemeow.promotion_service.dto.response.PromotionResponse;

import java.util.List;

public interface PromotionService {
    PromotionResponse create(PromotionRequest request);
    PromotionResponse getById(String id);
    List<PromotionResponse> getAll();
    PromotionResponse update(String id, PromotionRequest request);
    void delete(String id);
}
