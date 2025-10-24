package com.cinemeow.payment_service.facade;

import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.request.PaymentCallbackRequest;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;
import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.factory.PaymentServiceFactory;
import com.cinemeow.payment_service.repository.PaymentRepository;
import com.cinemeow.payment_service.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentFacade {

    PaymentServiceFactory factory;
    PaymentRepository paymentRepository;

    public InitPaymentResponse createPayment(InitPaymentRequest request) {
        return  null;
    }

    public PaymentCallbackResponse handleCallback(PaymentMethod method, PaymentCallbackRequest request) {
        PaymentService service = factory.getService(method);
        return service.handleCallback(request);
    }
}
