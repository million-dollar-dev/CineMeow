package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.enums.PromotionStatus;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class StatusActiveHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (promotion.getStatus() != PromotionStatus.ACTIVE) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi không hoạt động.")
                    .build();
        }
        return next(promotion, request);
    }
}
