package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.FnbItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FnbItemRepository extends JpaRepository<FnbItem, String> {
    @Query("SELECT i FROM FnbItem i WHERE i.cinemaBrand.id = :brandId AND i.id = :fnbItemId")
    Optional<FnbItem> findByIdAndBrandId(
            @Param("fnbItemId") String fnbItemId,
            @Param("brandId") String brandId);
}
