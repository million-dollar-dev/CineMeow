package com.cinemeow.payment_service.service.impl;

import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.request.PaymentCallbackRequest;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;
import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.exception.AppException;
import com.cinemeow.payment_service.exception.ErrorCode;
import com.cinemeow.payment_service.service.PaymentService;
import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PayPalService implements PaymentService {

    APIContext apiContext;

    @NonFinal
    @Value("${payment.cancel-url}")
    String cancelUrl;

    @NonFinal
    @Value("${payment.return-url}")
    String returnUrl;

    @Override
    public InitPaymentResponse createPayment(InitPaymentRequest request) {
        try {
            BigDecimal vndAmount = request.getAmount();
            BigDecimal exchangeRate = new BigDecimal("24000");

            BigDecimal usdAmount = vndAmount.divide(exchangeRate, 2, RoundingMode.HALF_UP);

            Amount amount = new Amount();
            amount.setCurrency("USD");
            amount.setTotal(String.format("%.2f", usdAmount));

            Transaction transaction = new Transaction();
            transaction.setDescription("Payment for CineMeow booking");
            transaction.setCustom(request.getBookingId());
            transaction.setAmount(amount);

            List<Transaction> transactions = List.of(transaction);

            Payer payer = new Payer();
            payer.setPaymentMethod("paypal");

            String returnUrlWithBooking = String.format("%s?bookingId=%s",
                    returnUrl, request.getBookingId());
            RedirectUrls redirectUrls = new RedirectUrls();
            redirectUrls.setCancelUrl(cancelUrl);
            redirectUrls.setReturnUrl(returnUrlWithBooking);

            Payment payment = new Payment();
            payment.setIntent("sale");
            payment.setPayer(payer);
            payment.setTransactions(transactions);
            payment.setRedirectUrls(redirectUrls);

            Payment createdPayment = payment.create(apiContext);

            String approvalUrl = createdPayment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel()))
                    .findFirst()
                    .map(Links::getHref)
                    .orElse(null);

            return InitPaymentResponse.builder()
                    .paymentUrl(approvalUrl)
                    .gateway("PAYPAL")
                    .build();
        } catch (Exception e) {
            throw new AppException(ErrorCode.PAYPAL_PAYMENT_FAILED);
        }
    }

    @Override
    public PaymentCallbackResponse handleCallback(Map<String, String> params) {
        try {
            String paymentId = params.get("paymentId");
            String payerId = params.get("PayerID");
            String bookingId = params.get("bookingId");

            Payment payment = new Payment();
            payment.setId(paymentId);

            PaymentExecution execution = new PaymentExecution();
            execution.setPayerId(payerId);

            Payment executed = payment.execute(apiContext, execution);

            boolean success = "approved".equalsIgnoreCase(executed.getState());

            return PaymentCallbackResponse.builder()
                    .paymentMethod(PaymentMethod.PAYPAL)
                    .success(success)
                    .message(executed.getState())
                    .bookingId(bookingId)
                    .build();

        } catch (Exception e) {
            throw new AppException(ErrorCode.PAYPAL_PAYMENT_FAILED);
        }
    }

}
