package com.cinemeow.promotion_service.dto.request;

import com.cinemeow.promotion_service.dto.response.SeatResponse;
import com.cinemeow.promotion_service.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "code must be not blank")
    String code;
    String userId;
    @NotBlank(message = "code must be not blank")
    String showtimeId;
    String cinemaId;
    @NotBlank(message = "code must be not blank")
    String brandName;
    @NotNull(message = "code must be not null")
    RoomType roomType;
    @NotBlank(message = "Payment's method must be not blank")
    String paymentMethod;
    @NotEmpty(message = "Seats must be not empty")
    List<SeatResponse> seats;
    List<String> fnbItemIds;
    @NotNull(message = "Total price must be not null")
    BigDecimal totalPrice;
    @NotNull(message = "Booking time must be not null")
    LocalDateTime bookingTime;
}

