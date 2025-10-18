package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class UsageLimitHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (promotion.getUsageLimit() != null
                && promotion.getUsedCount() >= promotion.getUsageLimit()) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi đã hết lượt sử dụng.")
                    .build();
        }
        return next(promotion, request);
    }
}
