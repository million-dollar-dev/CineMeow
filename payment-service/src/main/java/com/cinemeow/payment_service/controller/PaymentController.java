package com.cinemeow.payment_service.controller;

import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.response.BaseResponse;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;
import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.facade.PaymentFacade;
import com.cinemeow.payment_service.util.RequestUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/payments")
@Slf4j
@Tag(name = "Payment API", description = "Manage and process different payment methods such as VNPAY, PayPal, etc.")
public class PaymentController {

    PaymentFacade paymentFacade;

    @Operation(
            summary = "Initialize a new payment",
            description = """
                    Creates a payment session for the specified payment method (VNPAY, PayPal, etc.)  
                    and returns a payment URL that the client should redirect the user to.
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "Payment initialized successfully",
                            content = @Content(schema = @Schema(implementation = InitPaymentResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
                    @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
            }
    )
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

    @Operation(
            summary = "VNPAY IPN callback",
            description = """
                    This endpoint is called by VNPAY (via HTTP GET) after the user finishes or cancels payment.  
                    The backend verifies the signature, updates the payment status,  
                    and redirects the user to the frontend result page:  
                    **http://localhost:3000/payment/result?bookingId=...&status=...**
                    """
    )
    @GetMapping("/vnpay/ipn")
    public void handleVnpayIpn(@RequestParam Map<String, String> params,
                               HttpServletResponse response) throws IOException {
        PaymentCallbackResponse result = paymentFacade.handleCallback(params);
        String redirectUrl = String.format(
                "http://localhost:3000/payment/result?bookingId=%s&status=%s",
                result.getBookingId(),
                result.isSuccess() ? "success" : "failed"
        );
        log.info("VNPay callback result: {}", result);
        response.sendRedirect(redirectUrl);
    }

    @Operation(
            summary = "PayPal callback",
            description = """
                    This endpoint is called by PayPal after the user approves or cancels a payment.  
                    The backend executes the PayPal payment, updates the order status,  
                    and redirects the user to the frontend result page:  
                    **http://localhost:3000/payment/result?bookingId=...&status=...**
                    """
    )
    @GetMapping("/paypal/callback")
    public void handlePayPalCallback(@RequestParam Map<String, String> params,
                                     HttpServletResponse response) throws IOException {
        PaymentCallbackResponse result = paymentFacade.handleCallback(params);
        String redirectUrl = String.format(
                "http://localhost:3000/payment/result?bookingId=%s&status=%s",
                result.getBookingId(),
                result.isSuccess() ? "success" : "failed"
        );
        log.info("PayPal callback result: {}", result);
        response.sendRedirect(redirectUrl);
    }


}
