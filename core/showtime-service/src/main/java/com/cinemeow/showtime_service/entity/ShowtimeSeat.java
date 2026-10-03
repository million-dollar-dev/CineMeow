package com.cinemeow.showtime_service.entity;

import com.cinemeow.showtime_service.enums.SeatStatus;
import com.cinemeow.showtime_service.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "showtime_seat")
public class ShowtimeSeat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String showtimeId;

    Long seatId;

    @Column(name = "label")
    String label;

    @Enumerated(EnumType.STRING)
    SeatType type;

    @Enumerated(EnumType.STRING)
    SeatStatus status;

    LocalDateTime reservedUntil;

    String bookingId;
}
