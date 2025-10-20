package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(5)
public class ForGuestHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (!promotion.isForGuest() && request.getUserId() == null) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi chỉ áp dụng cho tài khoản đã đăng nhập.")
                    .build();
        }
        return next(promotion, request);
    }
}
