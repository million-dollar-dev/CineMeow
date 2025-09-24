package com.cinemeow.cinema_service.dto.response;

import com.cinemeow.cinema_service.enums.RoomStatus;
import com.cinemeow.cinema_service.enums.RoomType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomResponse {
    String id;
    String name;
    RoomType type;
    RoomStatus status;
    String cinemaId;
    String cinemaName;
}
