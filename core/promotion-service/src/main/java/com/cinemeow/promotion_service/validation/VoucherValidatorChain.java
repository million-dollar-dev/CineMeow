package com.cinemeow.promotion_service.validation;

import com.cinemeow.promotion_service.dto.request.VoucherValidationRequest;
import com.cinemeow.promotion_service.dto.response.VoucherValidationResponse;
import com.cinemeow.promotion_service.entity.Promotion;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoucherValidatorChain {

    List<VoucherValidationHandler> handlers;

    public VoucherValidationResponse validate(Promotion promotion, VoucherValidationRequest request) {
        if (handlers.isEmpty()) {
            return VoucherValidationResponse.builder()
                    .valid(true)
                    .message("Không có rule nào được áp dụng")
                    .build();
        }

        for (int i = 0; i < handlers.size() - 1; i++) {
            handlers.get(i).setNext(handlers.get(i + 1));
        }

        return handlers.get(0).handle(promotion, request);
    }
}

