package com.cinemeow.cinema_service.dto.response;

import com.cinemeow.cinema_service.entity.CinemaBrand;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CinemaDetailResponse {
    String id;
    String name;
    String address;
    String city;
    CinemaBrand brand;
    String imageUrl;
    int totalRoom;
}
