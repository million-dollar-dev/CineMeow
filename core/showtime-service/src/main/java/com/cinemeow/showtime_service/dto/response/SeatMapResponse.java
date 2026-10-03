package com.cinemeow.showtime_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatMapResponse {
    String roomId;

    String roomName;

    Integer rows;

    Integer columns;

    List<SeatResponse> seats;
}
