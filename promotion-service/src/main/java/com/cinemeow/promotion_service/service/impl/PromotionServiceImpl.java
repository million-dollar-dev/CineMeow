package com.cinemeow.promotion_service.service.impl;

import com.cinemeow.promotion_service.dto.request.PromotionConditionRequest;
import com.cinemeow.promotion_service.dto.request.PromotionRequest;
import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.PromotionResponse;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.entity.PromotionCondition;
import com.cinemeow.promotion_service.exception.AppException;
import com.cinemeow.promotion_service.exception.ErrorCode;
import com.cinemeow.promotion_service.mapper.PromotionMapper;
import com.cinemeow.promotion_service.repository.PromotionRepository;
import com.cinemeow.promotion_service.service.PromotionService;
import com.cinemeow.promotion_service.validation.VoucherValidatorChain;
import jakarta.transaction.Transactional;
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
    VoucherValidatorChain voucherValidatorChain;

    @Override
    public PromotionResponse create(PromotionRequest request) {
        var promotion = promotionMapper.toPromotion(request);
        if (promotion.getConditions() != null) {
            promotion.getConditions()
                    .forEach(condition -> condition.setPromotion(promotion));
        }
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
    @Transactional
    public PromotionResponse update(String id, PromotionRequest request) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));

        promotionMapper.update(promotion, request);

        promotion.getConditions().clear();

        if (request.getConditions() != null) {
            for (PromotionConditionRequest condReq : request.getConditions()) {
                PromotionCondition condition = new PromotionCondition();
                condition.setType(condReq.getType());
                condition.setValue(condReq.getValue());
                condition.setPromotion(promotion);
                promotion.getConditions().add(condition);
            }
        }

        promotionRepository.save(promotion);

        return promotionMapper.toPromotionResponse(promotion);
    }

    @Override
    public void delete(String id) {
        promotionRepository.deleteById(id);
    }

    @Override
    public VoucherValidationResponse validateVoucher(VoucherValidationRequest request) {
        Promotion promotion = promotionRepository.findByCode(request.getCode())
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));
        return voucherValidatorChain.validate(promotion, request);
    }

}
