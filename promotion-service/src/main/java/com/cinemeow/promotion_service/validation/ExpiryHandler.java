package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ExpiryHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        if (promotion.getStartDate() != null && now.isBefore(promotion.getStartDate())) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi chưa bắt đầu.")
                    .build();
        }
        if (promotion.getEndDate() != null && now.isAfter(promotion.getEndDate())) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi đã hết hạn.")
                    .build();
        }
        return next(promotion, request);
    }
}
