package com.cinemeow.booking_service.entity;

import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeSeat {
    Long id;
    String showtimeId;
    Long seatId;
    String label;
    SeatType type;
    SeatStatus status;
    LocalDateTime reservedUntil;
    String bookingId;
}
