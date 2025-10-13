package com.cinemeow.booking_service.dto.response;

import com.cinemeow.booking_service.enums.RoomType;
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
    String brandId;
    String brandName;
}
