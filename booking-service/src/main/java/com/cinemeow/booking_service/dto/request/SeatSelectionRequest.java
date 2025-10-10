package com.cinemeow.booking_service.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
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
public class SeatSelectionRequest {
    @NotBlank(message = "Seat ID is required")
    String seatId; // ID của ghế

    @NotBlank(message = "Seat label is required")
    String label;

    @NotNull(message = "Seat price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Seat price must be greater than 0")
    BigDecimal price;

    @NotBlank(message = "Seat type is required")
    String seatType; // NORMAL, VIP, COUPLE,...

    @AssertTrue(message = "Seat price and type must be valid")
    public boolean isValidSeat() {
        return price != null
                && price.compareTo(BigDecimal.ZERO) > 0
                && seatType != null && !seatType.isBlank();
    }
}
