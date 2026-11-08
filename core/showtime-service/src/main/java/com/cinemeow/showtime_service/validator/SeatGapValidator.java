package com.cinemeow.showtime_service.validator;

import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Validator to enforce the Single-Seat Gap Prevention Rule (CM-000004).
 * Prevents users from booking seats that leave a single isolated empty seat
 * between booked seats or between a booked seat and an aisle/wall.
 */
@Component
public class SeatGapValidator {

    /**
     * Checks if the selected seats leave any single isolated empty seat.
     *
     * @param allSeatsInRoom  All physical seats of the room/showtime with their coordinates and status.
     * @param selectedSeatIds The set of physical seat IDs the user is attempting to select/lock.
     * @return GapValidationResult containing validation status and details of the violated seat if any.
     */
    public GapValidationResult check(List<SeatPosition> allSeatsInRoom, Set<Long> selectedSeatIds) {
        if (allSeatsInRoom == null || allSeatsInRoom.isEmpty() || selectedSeatIds == null || selectedSeatIds.isEmpty()) {
            return GapValidationResult.ok();
        }

        // Group non-empty seats by rowIndex
        Map<Integer, List<SeatPosition>> seatsByRow = allSeatsInRoom.stream()
                .filter(s -> s.getType() != null && s.getType() != SeatType.EMPTY)
                .collect(Collectors.groupingBy(SeatPosition::getRowIndex));

        // Only evaluate rows that contain at least one of the selected seats
        for (Map.Entry<Integer, List<SeatPosition>> entry : seatsByRow.entrySet()) {
            List<SeatPosition> rowSeats = entry.getValue();

            boolean hasSelectedSeatInRow = rowSeats.stream()
                    .anyMatch(s -> selectedSeatIds.contains(s.getSeatId()));
            if (!hasSelectedSeatInRow) {
                continue;
            }

            // Sort seats from left to right by colIndex
            rowSeats.sort(Comparator.comparingInt(SeatPosition::getColIndex));

            // Partition the row into contiguous physical segments (separated by aisles/empty spaces)
            List<List<SeatPosition>> segments = partitionIntoContiguousSegments(rowSeats);

            for (List<SeatPosition> segment : segments) {
                List<SeatPosition> orphansBefore = findOrphanSeats(segment, Collections.emptySet());
                List<SeatPosition> orphansAfter = findOrphanSeats(segment, selectedSeatIds);

                // If the selection increases the number of isolated seats, report violation!
                if (orphansAfter.size() > orphansBefore.size()) {
                    Set<Long> beforeIds = orphansBefore.stream()
                            .map(SeatPosition::getSeatId)
                            .collect(Collectors.toSet());

                    SeatPosition newlyCreatedOrphan = orphansAfter.stream()
                            .filter(s -> !beforeIds.contains(s.getSeatId()))
                            .findFirst()
                            .orElse(orphansAfter.get(0));

                    return GapValidationResult.violation(newlyCreatedOrphan);
                }
            }
        }

        return GapValidationResult.ok();
    }

    /**
     * Validates that the selected seats do not create any new single empty seat gaps.
     *
     * @param allSeatsInRoom  All physical seats of the room/showtime with their coordinates and status.
     * @param selectedSeatIds The set of physical seat IDs the user is attempting to select/lock.
     * @throws AppException with ErrorCode.SEAT_SINGLE_GAP_VIOLATED if a new single-seat gap is created.
     */
    public void validate(List<SeatPosition> allSeatsInRoom, Set<Long> selectedSeatIds) {
        GapValidationResult result = check(allSeatsInRoom, selectedSeatIds);
        if (!result.isValid()) {
            String seatLabel = result.getViolatedSeatLabel() != null
                    ? result.getViolatedSeatLabel()
                    : ("Row " + result.getRowIndex() + ", Col " + result.getColIndex());

            throw new AppException(ErrorCode.SEAT_SINGLE_GAP_VIOLATED,
                    "Cannot leave a single isolated empty seat (" + seatLabel + ")");
        }
    }

    /**
     * Partitions a sorted list of seats in a row into contiguous segments.
     * An aisle or gap exists if colIndex[i] - colIndex[i-1] > 1.
     */
    private List<List<SeatPosition>> partitionIntoContiguousSegments(List<SeatPosition> rowSeats) {
        List<List<SeatPosition>> segments = new ArrayList<>();
        if (rowSeats.isEmpty()) {
            return segments;
        }

        List<SeatPosition> currentSegment = new ArrayList<>();
        currentSegment.add(rowSeats.get(0));

        for (int i = 1; i < rowSeats.size(); i++) {
            SeatPosition prev = rowSeats.get(i - 1);
            SeatPosition curr = rowSeats.get(i);

            if (curr.getColIndex() == prev.getColIndex() + 1) {
                currentSegment.add(curr);
            } else {
                segments.add(currentSegment);
                currentSegment = new ArrayList<>();
                currentSegment.add(curr);
            }
        }
        segments.add(currentSegment);
        return segments;
    }

    /**
     * Finds all single isolated empty seats (blocks of contiguous available seats of size == 1)
     * within a physical contiguous segment.
     */
    private List<SeatPosition> findOrphanSeats(List<SeatPosition> segment, Set<Long> selectedSeatIds) {
        List<SeatPosition> orphanSeats = new ArrayList<>();
        List<SeatPosition> currentAvailableBlock = new ArrayList<>();

        for (SeatPosition seat : segment) {
            boolean isAvailable = isSeatAvailable(seat, selectedSeatIds);

            if (isAvailable) {
                currentAvailableBlock.add(seat);
            } else {
                if (currentAvailableBlock.size() == 1) {
                    orphanSeats.add(currentAvailableBlock.get(0));
                }
                currentAvailableBlock.clear();
            }
        }

        // Check trailing block at the end of the segment
        if (currentAvailableBlock.size() == 1) {
            orphanSeats.add(currentAvailableBlock.get(0));
        }

        return orphanSeats;
    }

    /**
     * Determines whether a seat is effectively available.
     * A seat is available if its initial status is AVAILABLE AND it is not selected in the current request.
     */
    private boolean isSeatAvailable(SeatPosition seat, Set<Long> selectedSeatIds) {
        return seat.getStatus() == SeatStatus.AVAILABLE && !selectedSeatIds.contains(seat.getSeatId());
    }
}
