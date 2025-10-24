package com.cinemeow.payment_service.factory;

import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentServiceFactory {

    public PaymentService getService(PaymentMethod method) {
        return switch (method) {
            default -> null;
        };
    }
}
