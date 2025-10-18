package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class MinOrderValueHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (promotion.getMinOrderValue() != null &&
                request.getTotalPrice().compareTo(promotion.getMinOrderValue()) < 0) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Đơn chưa đạt giá trị tối thiểu: " + promotion.getMinOrderValue() + "đ")
                    .build();
        }
        return next(promotion, request);
    }
}
