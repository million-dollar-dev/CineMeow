package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
public class CalculatePriceResponse {
    @NotEmpty(message = "List seats must not empty")
    List<SelectedSeat> seatPrices;

    BigDecimal total;

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class SelectedSeat {
        @NotBlank(message = "Brand must not be blank")
        String seatId;

        @NotBlank(message = "label must not be blank")
        String label;

        @NotNull(message = "Seat's type must not be null")
        SeatType seatType;

        BigDecimal price;
    }
}
