package com.cinemeow.promotion_service.dto.request;

import com.cinemeow.promotion_service.dto.response.SeatResponse;
import com.cinemeow.promotion_service.enums.RoomType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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
    String brandName;
    RoomType roomType;
    String paymentMethod;
    List<SeatResponse> seats;
    List<String> fnbItemIds;
    BigDecimal totalPrice;
    LocalDateTime bookingTime;
}

