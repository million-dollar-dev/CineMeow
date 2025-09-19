package com.cinemeow.cinema_service.dto.response;

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
public class SeatResponse {
    Long id;
    Integer rowIndex;
    Integer colIndex;
    SeatType type;
    SeatStatus status;
}
