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
public class CinemaBrandRequest {
    @NotBlank(message = "Brand's name must be not blank")
    String name;
    String description;
    String logoUrl;
}
