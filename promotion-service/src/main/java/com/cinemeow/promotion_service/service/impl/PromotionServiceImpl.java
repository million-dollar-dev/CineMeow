package com.cinemeow.promotion_service.service.impl;

import com.cinemeow.promotion_service.dto.request.PromotionRequest;
import com.cinemeow.promotion_service.dto.response.PromotionResponse;
import com.cinemeow.promotion_service.exception.AppException;
import com.cinemeow.promotion_service.exception.ErrorCode;
import com.cinemeow.promotion_service.mapper.PromotionMapper;
import com.cinemeow.promotion_service.repository.PromotionRepository;
import com.cinemeow.promotion_service.service.PromotionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionServiceImpl implements PromotionService {

    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;

    @Override
    public PromotionResponse create(PromotionRequest request) {
        var promotion = promotionMapper.toPromotion(request);
        promotionRepository.save(promotion);
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public PromotionResponse getById(String id) {
        var promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public List<PromotionResponse> getAll() {
        return promotionRepository.findAll().stream()
                .map(promotionMapper::toPromotionResponse)
                .toList();
    }

    @Override
    public PromotionResponse update(String id, PromotionRequest request) {
        var promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));

        promotionMapper.update(promotion, request);
        promotionRepository.save(promotion);
        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public void delete(String id) {
        promotionRepository.deleteById(id);
    }
}
