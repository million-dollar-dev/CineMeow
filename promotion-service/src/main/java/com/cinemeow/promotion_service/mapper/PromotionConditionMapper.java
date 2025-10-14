package com.cinemeow.promotion_service.mapper;

import com.cinemeow.promotion_service.dto.request.PromotionConditionRequest;
import com.cinemeow.promotion_service.dto.response.PromotionConditionResponse;
import com.cinemeow.promotion_service.entity.PromotionCondition;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PromotionConditionMapper {
    PromotionCondition toPromotionCondition(PromotionConditionRequest request);
    PromotionConditionResponse toPromotionConditionResponse(PromotionCondition promotionCondition);
}
