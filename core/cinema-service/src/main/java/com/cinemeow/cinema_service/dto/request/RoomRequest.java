package com.cinemeow.cinema_service.dto.request;

import com.cinemeow.cinema_service.enums.RoomStatus;
import com.cinemeow.cinema_service.enums.RoomType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoomRequest {
    @NotBlank(message = "Room's name must be not blank")
    String name;

    @NotNull(message = "Room's type must be not null")
    RoomType type;

    @NotNull(message = "Room status is required")
    RoomStatus status;

    @NotNull(message = "Room's cinema must be not null")
    String cinemaId;
}
