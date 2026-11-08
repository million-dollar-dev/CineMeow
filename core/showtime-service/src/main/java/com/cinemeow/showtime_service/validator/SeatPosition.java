package com.cinemeow.showtime_service.validator;

import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatPosition {
    Long seatId;
    String label;
    int rowIndex;
    int colIndex;
    SeatType type;
    SeatStatus status;
}
