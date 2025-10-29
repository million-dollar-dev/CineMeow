package com.cinemeow.payment_service.repository;

import com.cinemeow.payment_service.entity.Payment;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    @Modifying
    @Transactional
    @Query("UPDATE Payment p SET p.status = :status WHERE p.bookingId = :bookingId")
    void updateStatusByBookingId(@Param("bookingId") String bookingId,
                                 @Param("status") String status);
}
