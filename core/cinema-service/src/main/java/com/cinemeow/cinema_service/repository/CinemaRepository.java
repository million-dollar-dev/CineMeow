package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.Cinema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CinemaRepository extends JpaRepository<Cinema, String> {
}
