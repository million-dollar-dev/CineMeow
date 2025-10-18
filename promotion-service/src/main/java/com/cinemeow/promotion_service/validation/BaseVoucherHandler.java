package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;

public abstract class BaseVoucherHandler implements VoucherValidationHandler {
    protected VoucherValidationHandler next;

    @Override
    public void setNext(VoucherValidationHandler next) {
        this.next = next;
    }

    protected VoucherValidationResponse next(Promotion promotion, VoucherValidationRequest request) {
        if (next != null)
            next.handle(promotion, request);
        return VoucherValidationResponse.builder()
                .valid(true)
                .message("Voucher hợp lệ")
                .build();
    }
}
