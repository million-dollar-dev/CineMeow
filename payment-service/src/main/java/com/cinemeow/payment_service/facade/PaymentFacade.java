package com.cinemeow.payment_service.facade;

import com.cinemeow.payment_service.client.BookingClient;
import com.cinemeow.payment_service.dto.request.InitPaymentRequest;
import com.cinemeow.payment_service.dto.request.PaymentCallbackRequest;
import com.cinemeow.payment_service.dto.response.InitPaymentResponse;
import com.cinemeow.payment_service.dto.response.PaymentCallbackResponse;
import com.cinemeow.payment_service.entity.Payment;
import com.cinemeow.payment_service.enums.BookingStatus;
import com.cinemeow.payment_service.enums.PaymentMethod;
import com.cinemeow.payment_service.factory.PaymentServiceFactory;
import com.cinemeow.payment_service.repository.PaymentRepository;
import com.cinemeow.payment_service.service.PaymentService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.lang.reflect.Method;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentFacade {

    PaymentServiceFactory factory;
    PaymentRepository paymentRepository;
    BookingClient bookingClient;

    public InitPaymentResponse createPayment(InitPaymentRequest request) {
        PaymentService service = factory.getService(request.getPaymentMethod());
        InitPaymentResponse response = service.createPayment(request);

        Payment payment = Payment.builder()
                .bookingId(request.getBookingId())
                .amount(request.getAmount())
                .method(request.getPaymentMethod())
                .status("PENDING")
                .build();
        paymentRepository.save(payment);

        return response;
    }

    public PaymentCallbackResponse handleCallback(Map<String, String> params) {
        PaymentMethod method = factory.identifyGateway(params);
        PaymentService service = factory.getService(method);
        PaymentCallbackResponse response = service.handleCallback(params);

        paymentRepository.updateStatusByBookingId(
                response.getBookingId(),
                response.isSuccess() ? "SUCCESS" : "FAILED"
        );
        // update booking status
        bookingClient.updateStatus(
                response.getBookingId(),
                response.isSuccess() ? BookingStatus.PAID : BookingStatus.CANCELLED
        );

        return response;
    }
}
