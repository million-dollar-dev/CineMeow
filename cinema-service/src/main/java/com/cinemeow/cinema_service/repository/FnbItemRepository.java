package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.FnbItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FnbItemRepository extends JpaRepository<FnbItem, String> {
    Optional<FnbItem> findByIdAndBrandId(String fnbItemId, String brandId);
}
