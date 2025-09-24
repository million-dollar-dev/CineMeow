package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat,Integer> {
    List<Seat> findAllByRoomId(String roomId);
}
