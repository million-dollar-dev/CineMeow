package com.cinemeow.showtime_service.dto.response;

import com.cinemeow.showtime_service.enums.ShowtimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeResponse {
    String id;

    String movieId;

    String movieTitle;

    String cinemaId;

    String cinemaName;

    String roomId;

    String roomName;

    LocalDateTime startTime;

    LocalDateTime endTime;

    ShowtimeStatus status;
}
