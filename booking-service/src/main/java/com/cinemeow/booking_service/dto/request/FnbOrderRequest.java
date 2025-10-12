package com.cinemeow.booking_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FnbOrderRequest {
    @NotBlank(message = "F&B item ID is required")
    String fnbItemId;

    @NotBlank(message = "F&B item name is required")
    String name;

    @Min(value = 1, message = "Quantity must be at least 1")
    int quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Unit price must be greater than 0")
    BigDecimal unitPrice;
}
