package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.entity.PromotionCondition;
import org.springframework.stereotype.Component;

@Component
public class ConditionListHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        for (PromotionCondition cond : promotion.getConditions()) {
//            switch (cond.getType()) {
//                case BRAND -> {
//                    if (!cond.getValue().equalsIgnoreCase(request.getBrand())) {
//                        throw new AppException(ErrorCode.PROMOTION_CONDITION_FAILED,
//                                "Khuyến mãi chỉ áp dụng cho thương hiệu " + cond.getValue());
//                    }
//                }
//                case SEAT_TYPE -> {
//                    boolean match = request.getSeats().stream()
//                            .anyMatch(s -> s.getType().equalsIgnoreCase(cond.getValue()));
//                    if (!match) {
//                        throw new AppException(ErrorCode.PROMOTION_CONDITION_FAILED,
//                                "Khuyến mãi chỉ áp dụng cho loại ghế " + cond.getValue());
//                    }
//                }
//            }
        }
        return next(promotion, request);
    }
}
