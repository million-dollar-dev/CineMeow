package com.cinemeow.showtime_service.repository;

import com.cinemeow.showtime_service.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ShowtimeRepository extends JpaRepository<Showtime, String>, JpaSpecificationExecutor<Showtime> {

    @Query(value = """
        SELECT * FROM show_times s
        WHERE s.room_id = :roomId
          AND s.status != :cancelledStatus
          AND s.start_time < :effectiveEndTime
          AND s.effective_end_time > :startTime
          AND (:excludeId IS NULL OR s.id != :excludeId)
        LIMIT 1
    """, nativeQuery = true)
    Optional<Showtime> findConflictingShowtime(
        @Param("roomId") String roomId,
        @Param("startTime") LocalDateTime startTime,
        @Param("effectiveEndTime") LocalDateTime effectiveEndTime,
        @Param("cancelledStatus") String cancelledStatus,
        @Param("excludeId") String excludeId
    );
}
