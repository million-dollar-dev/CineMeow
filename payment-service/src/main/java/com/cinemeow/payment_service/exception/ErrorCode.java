package com.cinemeow.payment_service.exception;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(403, "Access denied", HttpStatus.UNAUTHORIZED),
    VNPAY_SIGNING_FAILED(4004, "VnPay singing failure", HttpStatus.BAD_REQUEST),
    PAYPAL_PAYMENT_FAILED(4044, "Payment failed", HttpStatus.BAD_REQUEST),
    VNPAY_PAYMENT_FAILED(4044, "Payment failed", HttpStatus.BAD_REQUEST),
    PAYMENT_UNKNOWN_ERROR(5005, "Unknown error in payment", HttpStatus.INTERNAL_SERVER_ERROR),
    BOOKING_NOT_FOUND(4041, "Booking is not found", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_REQUEST(4040, "Invalid payment request", HttpStatus.BAD_REQUEST),
    PAYMENT_METHOD_NOT_ALLOWED(4051, "Payment method is not allowed", HttpStatus.METHOD_NOT_ALLOWED);

    ;

    int code;
    String message;
    HttpStatusCode statusCode;
}
