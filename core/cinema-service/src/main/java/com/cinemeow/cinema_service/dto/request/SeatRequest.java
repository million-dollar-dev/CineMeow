package com.cinemeow.cinema_service.dto.request;

import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatRequest {
    Long seatId;
    Integer rowIndex;
    Integer colIndex;
    SeatType type;
    SeatStatus status;
}
