package com.cinemeow.booking_service.repository;

import com.cinemeow.booking_service.entity.TicketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketPriceRepository extends JpaRepository<TicketPrice, String> {
}
