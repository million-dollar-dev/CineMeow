package com.cinemeow.payment_service.service;

import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.request.PaymentCallbackRequest;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;

public interface PaymentService {
    InitPaymentResponse createPayment(InitPaymentRequest request);
    PaymentCallbackResponse handleCallback(PaymentCallbackRequest request);
}
