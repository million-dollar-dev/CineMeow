package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.RoomType;
import com.cinemeow.booking_service.enums.ShowtimeStatus;
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

    String posterPath;

    String brandId;

    String brandName;

    String cinemaAddress;

    String cinemaId;

    String cinemaName;

    String roomId;

    String roomName;

    RoomType roomType;

    LocalDateTime startTime;

    LocalDateTime endTime;

    ShowtimeStatus status;
}
