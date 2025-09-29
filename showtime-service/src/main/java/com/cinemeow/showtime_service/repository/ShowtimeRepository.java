package com.cinemeow.showtime_service.repository;

import com.cinemeow.showtime_service.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShowtimeRepository extends JpaRepository<Showtime, String> {

}
