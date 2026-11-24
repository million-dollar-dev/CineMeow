package com.cinemeow.booking_service.validator;

import com.cinemeow.booking_service.dto.response.SeatResponse;
import com.cinemeow.booking_service.enums.SeatType;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class CoupleSeatValidator {

    /**
     * Validates that whenever a couple (Sweetbox) seat is selected,
     * its paired seat is also selected within the same request.
     *
     * @param requestedSeatIds List of seat IDs requested by customer
     * @param physicalSeatMap Map of physical seats in the room (seatId -> SeatResponse)
     */
    public void validateCoupleSeats(List<Long> requestedSeatIds, Map<Long, SeatResponse> physicalSeatMap) {
        if (requestedSeatIds == null || requestedSeatIds.isEmpty()) {
            return;
        }

        Set<Long> selectedSeatSet = new HashSet<>(requestedSeatIds);

        for (Long seatId : requestedSeatIds) {
            SeatResponse seat = physicalSeatMap.get(seatId);
            if (seat == null) {
                continue;
            }

            if (seat.getType() == SeatType.COUPLE) {
                Long pairSeatId = seat.getPairSeatId();
                if (pairSeatId == null) {
                    throw new AppException(
                            ErrorCode.INVALID_SEAT,
                            "Sweetbox seat " + seat.getLabel() + " is misconfigured (missing pair reference)"
                    );
                }

                if (!selectedSeatSet.contains(pairSeatId)) {
                    SeatResponse pairSeat = physicalSeatMap.get(pairSeatId);
                    String pairLabel = (pairSeat != null && pairSeat.getLabel() != null)
                            ? pairSeat.getLabel()
                            : String.valueOf(pairSeatId);
                    throw new AppException(
                            ErrorCode.SEAT_COUPLE_PAIR_INCOMPLETE,
                            "Ghế đôi " + seat.getLabel() + " bắt buộc phải đặt cùng ghế " + pairLabel
                    );
                }
            }
        }
    }
}
