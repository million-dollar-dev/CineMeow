package com.cinemeow.promotion_service.service.impl;

import com.cinemeow.promotion_service.dto.request.PromotionConditionRequest;
import com.cinemeow.promotion_service.dto.request.PromotionRequest;
import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.PromotionResponse;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.entity.PromotionCondition;
import com.cinemeow.promotion_service.enums.PromotionStatus;
import com.cinemeow.promotion_service.exception.AppException;
import com.cinemeow.promotion_service.exception.ErrorCode;
import com.cinemeow.promotion_service.mapper.PromotionMapper;
import com.cinemeow.promotion_service.repository.PromotionConditionRepository;
import com.cinemeow.promotion_service.repository.PromotionRepository;
import com.cinemeow.promotion_service.service.PromotionService;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PromotionServiceImpl implements PromotionService {

    PromotionRepository promotionRepository;
    PromotionMapper promotionMapper;
    PromotionConditionRepository promotionConditionRepository;

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
    public VoucherValidationResponse validateVoucher(String code, VoucherValidationRequest request) {
        Promotion promotion = promotionRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_EXISTED));

        if (!promotion.getStatus().equals(PromotionStatus.ACTIVE) ||
                LocalDateTime.now().isBefore(promotion.getStartDate()) ||
                LocalDateTime.now().isAfter(promotion.getEndDate())) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Voucher đã hết hạn hoặc chưa kích hoạt.")
                    .build();
        }

        boolean allConditionsPassed = true;
        for (PromotionCondition cond : promotion.getConditions()) {
            if (request.getTotalPrice().compareTo(new BigDecimal(String.valueOf(promotion.getMinOrderValue()))) >= 0) {
                allConditionsPassed = false;
                break;
            }

            if (!checkCondition(cond, request)) {
                allConditionsPassed = false;
                break;
            }
        }

        if (!allConditionsPassed) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Không đáp ứng điều kiện áp dụng voucher.")
                    .build();
        }

        BigDecimal discount = calculateDiscount(promotion, request.getTotalPrice());
        BigDecimal finalPrice = request.getTotalPrice().subtract(discount);

        return VoucherValidationResponse.builder()
                .valid(true)
                .message("Áp dụng voucher thành công.")
                .discountAmount(discount)
                .finalPrice(finalPrice)
                .build();
    }

    private boolean checkCondition(PromotionCondition cond, VoucherValidationRequest request) {
        switch (cond.getType()) {
            case MIN_ORDER_AMOUNT:
                return request.getTotalPrice().compareTo(new BigDecimal(cond.getValue())) >= 0;
            case BRAND:
                return request.getCinemaId() != null && request.getCinemaId().equalsIgnoreCase(cond.getValue());
            case ROOM_TYPE:
                // nếu bạn có API để lấy roomType từ showtime → gọi sang CinemaService
                return true; // demo
            case SEAT_TYPE:
                // nếu có danh sách seatIds → kiểm tra loại ghế
                return true;
            case DATE_RANGE:
                // ví dụ kiểm tra suất chiếu trong khoảng
                return true;
            default:
                return true;
        }
    }

    private BigDecimal calculateDiscount(Promotion promotion, BigDecimal total) {
        if (promotion.getDiscountType() == DiscountType.PERCENTAGE) {
            BigDecimal percent = promotion.getDiscountValue().divide(BigDecimal.valueOf(100));
            BigDecimal discount = total.multiply(percent);
            return discount.min(promotion.getMaxDiscount() != null ? promotion.getMaxDiscount() : discount);
        } else {
            return promotion.getDiscountValue();
        }
    }

}
