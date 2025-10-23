package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.enums.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findAllByIdIn(List<Long> ids);
    List<Seat> findAllByRoomId(String roomId);
    @Query("SELECT s FROM Seat s WHERE s.id IN :ids AND s.status = :status")
    List<Seat> findByIdInAndStatus(@Param("ids") List<Long> ids,
                                   @Param("status") SeatStatus status);

}
