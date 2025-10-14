package com.cinemeow.promotion_service.repository;

import com.cinemeow.promotion_service.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, String> {
}
