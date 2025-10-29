package com.cinemeow.booking_service.repository;

import com.cinemeow.booking_service.entity.Booking;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookingRepository extends CrudRepository<Booking, String> {
    Optional<Booking> findById(String id);
}
