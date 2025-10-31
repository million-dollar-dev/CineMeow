package com.cinemeow.booking_service.client;

import com.cinemeow.booking_service.dto.request.InitPaymentRequest;
import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.InitPaymentResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "payment-service",
        url = "${app.services.payment-service}",
        path = "/payments"
)
public interface PaymentClient {
    @PostMapping("/create")
    BaseResponse<InitPaymentResponse> createPayment(@RequestBody InitPaymentRequest request);
}
