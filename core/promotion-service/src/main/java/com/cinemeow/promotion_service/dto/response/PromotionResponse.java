package com.cinemeow.promotion_service.dto.response;

import com.cinemeow.promotion_service.enums.PromotionStatus;
import com.cinemeow.promotion_service.enums.PromotionType;
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
public class PromotionResponse {
    String id;

    String code;

    String name;

    String description;

    PromotionType type;

    BigDecimal value;

    BigDecimal minOrderValue;

    LocalDateTime startDate;

    LocalDateTime endDate;

    PromotionStatus status;

    boolean forGuest;

    boolean applyFnb;

    boolean applyTicket;

    List<PromotionConditionResponse> conditions;
}

