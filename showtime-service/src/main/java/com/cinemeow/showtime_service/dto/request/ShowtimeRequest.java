package com.cinemeow.showtime_service.dto.request;

import com.cinemeow.showtime_service.enums.ShowtimeStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowtimeRequest {
    @NotBlank(message = "Movie's id must be not blank")
    @NotNull(message = "Movie's id must be null")
    String movieId;

    @NotBlank(message = "Cinema's id must be not blank")
    @NotNull(message = "Cinema's id must be null")
    String roomId;

    @NotNull(message = "Start time must not be null")
    LocalDateTime startTime;

    @NotNull(message = "End time must not be null")
    LocalDateTime endTime;

    ShowtimeStatus status;
}
