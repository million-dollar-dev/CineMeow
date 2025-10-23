package com.cinemeow.booking_service.repository;

import com.cinemeow.booking_service.entity.TicketPrice;
import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TicketPriceRepository extends JpaRepository<TicketPrice, String> {
    boolean existsByBrandIdAndRoomTypeAndSeatType(String brandId, RoomType roomType, SeatType seatType);
    List<TicketPrice> findAllByBrandId(String brandId);
    @Query("SELECT p " +
            "FROM TicketPrice p " +
            "WHERE p.brandId = :brandId AND p.roomType = :roomType AND p.seatType = :seatType")
    Optional<TicketPrice> findByBrandIdAndRoomTypeAndSeatType(@Param("brandId") String brandId,
                                                              @Param("roomType") RoomType roomType,
                                                              @Param("seatType") SeatType seatType);
}
