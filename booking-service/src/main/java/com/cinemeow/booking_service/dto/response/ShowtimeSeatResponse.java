package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.SeatStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShowtimeSeatResponse {
    Long seatId;
    String label;
    SeatStatus status;
    LocalDateTime reservedUntil;
}
