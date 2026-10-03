package com.cinemeow.cinema_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FnbCalculateResponse {

    BigDecimal totalPrice;
    List<ItemDetail> items;

    @Builder
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class ItemDetail {
        String id;
        String name;
        int quantity;
        BigDecimal unitPrice;
        BigDecimal subtotal;
    }
}
