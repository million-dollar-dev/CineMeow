package com.cinemeow.promotion_service.dto.request;

import com.cinemeow.promotion_service.enums.ConditionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionConditionRequest {
    @NotNull(message = "Condition's type must be not null")
    ConditionType type;

    @NotBlank(message = "Condition's value must be not blank")
    String value;
}

