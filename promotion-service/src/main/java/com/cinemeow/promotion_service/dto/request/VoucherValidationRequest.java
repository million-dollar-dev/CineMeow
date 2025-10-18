package com.cinemeow.promotion_service.dto.request;

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
public class VoucherValidationRequest {
    String userId;
    String showtimeId;
    String cinemaId;
    List<String> seatIds;
    List<String> fnbItemIds;
    BigDecimal totalPrice;
}

