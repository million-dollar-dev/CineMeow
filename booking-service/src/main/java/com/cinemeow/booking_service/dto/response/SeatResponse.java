package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
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
    String label;
    SeatType type;
    SeatStatus status;
}
