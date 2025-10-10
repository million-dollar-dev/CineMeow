package com.cinemeow.booking_service.repository;

import com.cinemeow.booking_service.entity.Booking;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends CrudRepository<Booking, String> {
}
