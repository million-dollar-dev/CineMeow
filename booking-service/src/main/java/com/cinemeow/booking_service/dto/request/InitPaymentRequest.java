package com.cinemeow.booking_service.dto.request;

import com.cinemeow.booking_service.enums.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InitPaymentRequest {
    String userId;
    String bookingId;
    BigDecimal amount;
    PaymentMethod paymentMethod;
}
