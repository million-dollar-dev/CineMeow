package com.cinemeow.promotion_service.dto.response;

import com.cinemeow.promotion_service.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatResponse {
    Long id;
    String label;
    SeatType type;
}
