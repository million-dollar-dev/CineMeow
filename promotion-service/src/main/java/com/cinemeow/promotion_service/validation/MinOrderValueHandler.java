package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Slf4j
@Order(4)
public class MinOrderValueHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        BigDecimal minOrderValue = promotion.getMinOrderValue();
        BigDecimal totalPrice = request.getTotalPrice();

        if (minOrderValue != null) {
            if (totalPrice == null || totalPrice.compareTo(minOrderValue) < 0) {
                return VoucherValidationResponse.builder()
                        .valid(false)
                        .message(String.format("Đơn hàng chưa đạt giá trị tối thiểu %.0f₫", minOrderValue))
                        .build();
            }
        }

        return next(promotion, request);
    }
}
