package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketPriceResponse {
    String brandId;

    String brandName;

    String logoUrl;

    SeatType seatType;

    RoomType roomType;

    BigDecimal price;
}
