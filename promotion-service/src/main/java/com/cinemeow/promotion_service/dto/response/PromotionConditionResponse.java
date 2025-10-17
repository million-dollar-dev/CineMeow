package com.cinemeow.promotion_service.dto.response;

import com.cinemeow.promotion_service.enums.ConditionType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PromotionConditionResponse {
    String id;

    ConditionType type;

    String value;
}

