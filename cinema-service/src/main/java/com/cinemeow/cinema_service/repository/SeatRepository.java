package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.Seat;
import com.cinemeow.cinema_service.enums.SeatStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findAllByIdIn(List<Long> ids);
    List<Seat> findAllByRoomId(String roomId);
    List<Seat> findByIdInAndStatus(List<Long> ids, SeatStatus status);
}
