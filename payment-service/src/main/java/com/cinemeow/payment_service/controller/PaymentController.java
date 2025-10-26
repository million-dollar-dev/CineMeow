package com.cinemeow.payment_service.controller;

import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.response.BaseResponse;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.facade.PaymentFacade;
import com.cinemeow.payment_service.util.RequestUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/payments")
public class PaymentController {

    PaymentFacade paymentFacade;

    @PostMapping("/create")
    public BaseResponse<InitPaymentResponse> createPayment(
            @RequestBody InitPaymentRequest request,
            HttpServletRequest httpServletRequest) {
        var ipAddress = RequestUtil.getIpAddress(httpServletRequest);
        request.setIpAddress(ipAddress);

        return BaseResponse.<InitPaymentResponse>builder()
                .data(paymentFacade.createPayment(request))
                .build();
    }

}
