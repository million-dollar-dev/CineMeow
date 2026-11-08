package com.cinemeow.showtime_service.validator;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GapValidationResult {
    boolean valid;
    String violatedSeatLabel;
    Long violatedSeatId;
    Integer rowIndex;
    Integer colIndex;

    public static GapValidationResult ok() {
        return GapValidationResult.builder().valid(true).build();
    }

    public static GapValidationResult violation(SeatPosition seat) {
        return GapValidationResult.builder()
                .valid(false)
                .violatedSeatLabel(seat.getLabel())
                .violatedSeatId(seat.getSeatId())
                .rowIndex(seat.getRowIndex())
                .colIndex(seat.getColIndex())
                .build();
    }
}
