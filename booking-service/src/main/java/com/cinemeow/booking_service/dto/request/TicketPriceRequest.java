package com.cinemeow.booking_service.dto.request;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TicketPriceRequest {
    @NotBlank(message = "Brand must not be blank")
    String brandId;

    @NotNull(message = "Seat's type must not be null")
    SeatType seatType;

    @NotNull(message = "Room's type must not be null")
    RoomType roomType;

    @NotBlank(message = "Price must not be blank")
    BigDecimal price;
}
