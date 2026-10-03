package com.cinemeow.promotion_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoucherValidationResponse {
    boolean valid;
    String message;
    BigDecimal discountAmount;
    BigDecimal finalPrice;
}

