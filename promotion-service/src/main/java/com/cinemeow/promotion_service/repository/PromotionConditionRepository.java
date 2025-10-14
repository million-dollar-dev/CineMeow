package com.cinemeow.promotion_service.repository;

import com.cinemeow.promotion_service.entity.PromotionCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionConditionRepository extends JpaRepository<PromotionCondition, String> {
}
