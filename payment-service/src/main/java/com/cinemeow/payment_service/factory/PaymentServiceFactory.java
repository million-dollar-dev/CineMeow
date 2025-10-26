package com.cinemeow.payment_service.factory;

import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.service.PaymentService;
import com.cinemeow.payment_service.service.impl.VNPayService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PaymentServiceFactory {

    VNPayService vnPayService;

    public PaymentService getService(PaymentMethod method) {
        return switch (method) {
            case VNPAY -> vnPayService;
            case MOMO -> null;
        };
    }
}
