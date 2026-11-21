package com.cinemeow.booking_service.repository;

import com.cinemeow.booking_service.entity.BookedSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookedSeatRepository extends JpaRepository<BookedSeat, String> {
    @Query("""
        SELECT bs FROM BookedSeat bs
        JOIN FETCH bs.booking b
        WHERE b.showtimeId = :showtimeId
          AND (b.status = com.cinemeow.booking_service.enums.BookingStatus.PAID
               OR (b.status = com.cinemeow.booking_service.enums.BookingStatus.PENDING_PAYMENT AND b.createdAt >= :expireThreshold))
    """)
    List<BookedSeat> findActiveBookedSeatsByShowtime(
        @Param("showtimeId") String showtimeId,
        @Param("expireThreshold") LocalDateTime expireThreshold
    );
}
