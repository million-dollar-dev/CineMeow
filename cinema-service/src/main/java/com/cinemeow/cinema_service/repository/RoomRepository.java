package com.cinemeow.cinema_service.repository;

import com.cinemeow.cinema_service.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    @Query("SELECT r FROM Room r WHERE r.cinema.id = :cinemaId")
    List<Room> getRoomsByCinemaId(@Param("cinemaId") String id);
}
