package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;

public interface VoucherValidationHandler {
    void setNext(VoucherValidationHandler next);
    VoucherValidationResponse handle(Promotion promotion, VoucherValidationRequest request);
}
