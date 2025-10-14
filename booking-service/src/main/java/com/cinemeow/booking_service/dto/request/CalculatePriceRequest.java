package com.cinemeow.booking_service.dto.request;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CalculatePriceRequest {
    @NotEmpty(message = "List seats must not empty")
    List<SelectedSeat> items;

    @Builder
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class SelectedSeat {
        @NotBlank(message = "Brand must not be blank")
        String seatId;

        @NotBlank(message = "Brand must not be blank")
        String brandId;

        @NotNull(message = "Seat's type must not be null")
        SeatType seatType;

        @NotBlank(message = "Label must is not blank")
        String label;

        @NotNull(message = "Room's type must not be null")
        RoomType roomType;
    }
}
