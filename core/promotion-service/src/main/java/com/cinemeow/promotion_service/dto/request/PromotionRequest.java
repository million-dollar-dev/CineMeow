package com.cinemeow.promotion_service.dto.request;

import com.cinemeow.promotion_service.enums.PromotionStatus;
import com.cinemeow.promotion_service.enums.PromotionType;
import jakarta.validation.constraints.DecimalMin;
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
public class PromotionRequest {
    @NotBlank(message = "Code must be not blank")
    String code;

    @NotBlank(message = "Name must be not blank")
    String name;

    String description;

    @NotNull(message = "Promotion's type must be not null")
    PromotionType type;

    @DecimalMin(value = "0.0", inclusive = false, message = "Promotion value must be greater than 0")
    BigDecimal value;

    @DecimalMin(value = "0.0", inclusive = true, message = "Minimum order value cannot be negative")
    BigDecimal minOrderValue;

    Integer usageLimit;

    @NotNull(message = "Promotion's start date must be not null")
    LocalDateTime startDate;

    @NotNull(message = "Promotion's end date must be not null")
    LocalDateTime endDate;

    @NotNull(message = "Status must be not null")
    PromotionStatus status;

    boolean forGuest;

    boolean applyFnb;

    boolean applyTicket;

    List<PromotionConditionRequest> conditions;
}

