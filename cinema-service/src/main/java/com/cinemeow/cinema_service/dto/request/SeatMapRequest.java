package com.cinemeow.cinema_service.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatMapRequest {
    @NotNull(message = "Row must be not null")
    Integer rows;

    @NotNull(message = "Column id must be not null")
    Integer columns;

    @NotEmpty(message = "Seats list must be not empty")
    List<SeatRequest> seats;
}
