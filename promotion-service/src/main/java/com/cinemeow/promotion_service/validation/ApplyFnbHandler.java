package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

@Component
@Order(7)
public class ApplyFnbHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (!promotion.isApplyFnb() && !CollectionUtils.isEmpty(request.getFnbItemIds())) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi không áp dụng cho bắp nước.")
                    .build();
        }
        return next(promotion, request);
    }
}
