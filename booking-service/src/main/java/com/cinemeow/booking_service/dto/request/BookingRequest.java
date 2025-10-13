package com.cinemeow.booking_service.dto.request;

import com.cinemeow.booking_service.entity.BookedFnbItem;
import com.cinemeow.booking_service.entity.BookedSeat;
import com.cinemeow.booking_service.entity.GuestInfo;
import com.cinemeow.booking_service.enums.BookingStatus;
import jakarta.persistence.Embedded;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
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
public class BookingRequest {
    String userId;

    @NotBlank(message = "Showtime ID is required")
    String showtimeId;

    @DecimalMin(value = "0.0", inclusive = true, message = "Discount amount cannot be negative")
    BigDecimal discountAmount = BigDecimal.ZERO;

    @NotNull(message = "Final price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Final price must be greater than 0")
    BigDecimal finalPrice;

    @Size(max = 50, message = "Voucher code must not exceed 50 characters")
    String voucherCode;

    @Valid
    GuestInfo guestInfo;

    @NotEmpty(message = "Seats list cannot be empty")
    @Valid
    List<Long> seatIds;

    @Valid
    List<FnbOrderRequest> fnbItems;

    LocalDateTime createdAt;
}
