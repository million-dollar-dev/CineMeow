package com.cinemeow.cinema_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CinemaRequest {
    @NotBlank(message = "Cinema's name must be not blank")
    String name;

    @NotBlank(message = "Cinema's address must be not blank")
    String address;

    @NotBlank(message = "Cinema's city must be not blank")
    String city;

    @NotBlank(message = "Brand's id must be not blank")
    String brandId;

    @NotBlank(message = "Brand's image must be not blank")
    String imageUrl;
}
