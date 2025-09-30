package com.cinemeow.showtime_service.repository;

import com.cinemeow.showtime_service.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShowtimeRepository extends JpaRepository<Showtime, String>, JpaSpecificationExecutor<Showtime> {

}
