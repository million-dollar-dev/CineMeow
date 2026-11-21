package com.cinemeow.booking_service.validator;

import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SeatGapValidator Unit Tests (Single-Seat Gap Rule in booking-service)")
class SeatGapValidatorTest {

    private SeatGapValidator validator;

    @BeforeEach
    void setUp() {
        validator = new SeatGapValidator();
    }

    private SeatPosition buildSeat(long id, String label, int row, int col, SeatStatus status) {
        return SeatPosition.builder()
                .seatId(id)
                .label(label)
                .rowIndex(row)
                .colIndex(col)
                .type(SeatType.NORMAL)
                .status(status)
                .build();
    }

    private List<SeatPosition> createRow(int rowIndex, int totalCols, Set<Integer> bookedCols) {
        List<SeatPosition> seats = new ArrayList<>();
        char rowLetter = (char) ('A' + rowIndex);
        for (int col = 0; col < totalCols; col++) {
            SeatStatus status = bookedCols.contains(col) ? SeatStatus.BOOKED : SeatStatus.AVAILABLE;
            seats.add(buildSeat((long) (rowIndex * 100 + col + 1), "" + rowLetter + (col + 1), rowIndex, col, status));
        }
        return seats;
    }

    @Test
    @DisplayName("Case 1: Should REJECT when selection leaves 1 isolated gap between booked seats")
    void testMiddleOrphanGap_ShouldReject() {
        // Row A: 10 seats [A1..A10]
        // A1, A2, A3 (cols 0, 1, 2) are BOOKED
        // User selects A5, A6 (cols 4, 5) -> leaves A4 (col 3) alone!
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));
        Set<Long> selectedSeatIds = Set.of(5L, 6L); // A5, A6

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertFalse(result.isValid());
        assertEquals("A4", result.getViolatedSeatLabel());
        assertEquals(4L, result.getViolatedSeatId());

        AppException ex = assertThrows(AppException.class, () -> validator.validate(seats, selectedSeatIds));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
    }

    @Test
    @DisplayName("Case 2: Should REJECT when selection leaves 1 isolated gap at left wall")
    void testLeftWallOrphanGap_ShouldReject() {
        // Row A: 10 seats [A1..A10] all available
        // User selects A2, A3 (cols 1, 2) -> leaves A1 (col 0) alone next to the wall!
        List<SeatPosition> seats = createRow(0, 10, Collections.emptySet());
        Set<Long> selectedSeatIds = Set.of(2L, 3L); // A2, A3

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertFalse(result.isValid());
        assertEquals("A1", result.getViolatedSeatLabel());
        assertEquals(1L, result.getViolatedSeatId());
    }

    @Test
    @DisplayName("Case 3: Should REJECT when selection leaves 1 isolated gap at right wall")
    void testRightWallOrphanGap_ShouldReject() {
        // Row A: 10 seats [A1..A10] all available
        // User selects A8, A9 (cols 7, 8) -> leaves A10 (col 9) alone next to the wall!
        List<SeatPosition> seats = createRow(0, 10, Collections.emptySet());
        Set<Long> selectedSeatIds = Set.of(8L, 9L); // A8, A9

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertFalse(result.isValid());
        assertEquals("A10", result.getViolatedSeatLabel());
        assertEquals(10L, result.getViolatedSeatId());
    }

    @Test
    @DisplayName("Case 4: Should ALLOW when selection is adjacent to booked seats")
    void testAdjacentBooking_ShouldAllow() {
        // Row A: A1, A2, A3 are BOOKED
        // User selects A4, A5 (adjacent to A3) -> leaves A6..A10 (5 seats empty) -> OK!
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));
        Set<Long> selectedSeatIds = Set.of(4L, 5L);

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertTrue(result.isValid());
        assertDoesNotThrow(() -> validator.validate(seats, selectedSeatIds));
    }

    @Test
    @DisplayName("Case 5: Should ALLOW when selection leaves >= 2 empty seats (social distancing / acceptable gap)")
    void testTwoSeatGap_ShouldAllow() {
        // Row A: A1, A2, A3 are BOOKED
        // User selects A6, A7 -> leaves A4, A5 (2 empty seats) -> ALLOW!
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));
        Set<Long> selectedSeatIds = Set.of(6L, 7L);

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertTrue(result.isValid());
    }

    @Test
    @DisplayName("Case 6: Should ALLOW when selecting the exact orphan seat to fill the gap")
    void testFillingTheGap_ShouldAllow() {
        // Row A: A1..A3 booked, A5..A10 booked, A4 is an existing orphan!
        // User books A4 -> fills the gap!
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2, 4, 5, 6, 7, 8, 9));
        Set<Long> selectedSeatIds = Set.of(4L);

        GapValidationResult result = validator.check(seats, selectedSeatIds);

        assertTrue(result.isValid());
    }

    @Test
    @DisplayName("Case 7: Should handle aisles correctly (empty type seats break contiguous segments)")
    void testAislePartitioning() {
        // Row A: A1, A2 [col 0, 1], AISLE (gap in colIndex), A3, A4 [col 4, 5]
        List<SeatPosition> seats = List.of(
                buildSeat(1L, "A1", 0, 0, SeatStatus.AVAILABLE),
                buildSeat(2L, "A2", 0, 1, SeatStatus.AVAILABLE),
                // Notice: cols 2, 3 are an aisle
                buildSeat(3L, "A3", 0, 4, SeatStatus.AVAILABLE),
                buildSeat(4L, "A4", 0, 5, SeatStatus.AVAILABLE)
        );

        // Selecting A2 leaves A1 alone in segment 1 -> Should REJECT!
        GapValidationResult res1 = validator.check(seats, Set.of(2L));
        assertFalse(res1.isValid());
        assertEquals("A1", res1.getViolatedSeatLabel());

        // Selecting A1, A2 fills segment 1 -> Should ALLOW!
        GapValidationResult res2 = validator.check(seats, Set.of(1L, 2L));
        assertTrue(res2.isValid());
    }

    @Test
    @DisplayName("Case 8: Should return OK for empty inputs or nulls")
    void testEdgeCases() {
        assertTrue(validator.check(null, Set.of(1L)).isValid());
        assertTrue(validator.check(Collections.emptyList(), Set.of(1L)).isValid());
        assertTrue(validator.check(createRow(0, 5, Collections.emptySet()), null).isValid());
        assertTrue(validator.check(createRow(0, 5, Collections.emptySet()), Collections.emptySet()).isValid());
    }
}
