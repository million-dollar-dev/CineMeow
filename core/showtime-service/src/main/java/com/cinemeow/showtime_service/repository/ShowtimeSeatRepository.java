package com.cinemeow.showtime_service.repository;

import com.cinemeow.showtime_service.entity.ShowtimeSeat;
import com.cinemeow.showtime_service.enums.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Long> {
    List<ShowtimeSeat> findAllByIdIn(List<Long> ids);

    List<ShowtimeSeat> findAllByShowtimeId(String showtimeId);

    @Query("SELECT s " +
            "FROM ShowtimeSeat s " +
            "WHERE s.seatId IN :ids AND s.status = :status AND s.showtimeId = :showtimeId")
    List<ShowtimeSeat> findBySeatIdInAndStatusAndShowtimeId(@Param("ids") List<Long> ids,
                                                            @Param("status") SeatStatus status,
                                                            @Param("showtimeId") String showtimeId);
}
