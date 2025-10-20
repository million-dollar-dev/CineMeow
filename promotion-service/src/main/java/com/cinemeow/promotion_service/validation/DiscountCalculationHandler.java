package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import com.cinemeow.promotion_service.enums.PromotionType;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(9)
public class DiscountCalculationHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        BigDecimal discount = BigDecimal.ZERO;

        if (PromotionType.PERCENTAGE.equals(promotion.getType())) {
            discount = request.getTotalPrice()
                    .multiply(promotion.getValue().divide(BigDecimal.valueOf(100)));
        } else {
            discount = promotion.getValue();
        }

        BigDecimal finalPrice = request.getTotalPrice().subtract(discount);
        if (finalPrice.compareTo(BigDecimal.ZERO) < 0) finalPrice = BigDecimal.ZERO;

        return VoucherValidationResponse.builder()
                .valid(true)
                .message("Áp dụng voucher thành công")
                .discountAmount(discount)
                .finalPrice(finalPrice)
                .build();
    }
}
