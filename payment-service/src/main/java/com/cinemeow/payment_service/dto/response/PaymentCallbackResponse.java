package com.cinemeow.payment_service.dto.response;

import com.cinemeow.payment_service.enums.PaymentMethod;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentCallbackResponse {
    PaymentMethod paymentMethod;
    String bookingId;
    boolean success;
    String message;
}
