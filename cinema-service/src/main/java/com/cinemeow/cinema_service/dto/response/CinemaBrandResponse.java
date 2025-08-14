package com.cinemeow.cinema_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CinemaBrandResponse {
    String id;
    String name;
    String description;
    String logoUrl;
}
