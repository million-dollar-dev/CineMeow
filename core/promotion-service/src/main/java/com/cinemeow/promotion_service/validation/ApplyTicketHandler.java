package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(6)
public class ApplyTicketHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (!promotion.isApplyTicket() && !request.getSeats().isEmpty()) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi không áp dụng cho vé xem phim.")
                    .build();
        }
        return next(promotion, request);
    }
}
