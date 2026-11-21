package com.cinemeow.booking_service.validator;

import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
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
