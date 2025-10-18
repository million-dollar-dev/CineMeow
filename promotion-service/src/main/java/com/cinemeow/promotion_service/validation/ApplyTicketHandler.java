package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.stereotype.Component;

@Component
public class ApplyTicketHandler extends BaseVoucherHandler {
    @Override
    public VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request) {
        if (!promotion.isApplyTicket() && !request.getSeatIds().isEmpty()) {
            return VoucherValidationResponse.builder()
                    .valid(false)
                    .message("Khuyến mãi không áp dụng cho vé xem phim.")
                    .build();
        }
        return next(promotion, request);
    }
}
