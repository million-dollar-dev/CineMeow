package com.cinemeow.showtime_service.validator;

import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("SeatGapValidator Unit Tests (Single-Seat Gap Rule)")
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
        // A4..A10 (cols 3..9) are AVAILABLE
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));

        // Customer selects A5 (id=5) and A6 (id=6) (cols 4, 5)
        // A4 (col 3) is left isolated between A3 (booked) and A5 (selected)
        Set<Long> selectedSeatIds = Set.of(5L, 6L);

        AppException ex = assertThrows(AppException.class, () -> validator.validate(seats, selectedSeatIds));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("A4"), "Error message should mention violated seat A4");
    }

    @Test
    @DisplayName("Case 2: Should REJECT when selection leaves 1 isolated gap at left wall")
    void testLeftWallOrphanGap_ShouldReject() {
        // Row A: 10 seats, all AVAILABLE
        List<SeatPosition> seats = createRow(0, 10, Collections.emptySet());

        // Customer selects A2 (id=2) and A3 (id=3) (cols 1, 2)
        // A1 (col 0) is left isolated against the left wall
        Set<Long> selectedSeatIds = Set.of(2L, 3L);

        AppException ex = assertThrows(AppException.class, () -> validator.validate(seats, selectedSeatIds));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("A1"), "Error message should mention violated seat A1");
    }

    @Test
    @DisplayName("Case 3: Should REJECT when selection leaves 1 isolated gap at right wall")
    void testRightWallOrphanGap_ShouldReject() {
        // Row A: 10 seats, all AVAILABLE
        List<SeatPosition> seats = createRow(0, 10, Collections.emptySet());

        // Customer selects A8 (id=8) and A9 (id=9) (cols 7, 8)
        // A10 (col 9, id=10) is left isolated against the right wall
        Set<Long> selectedSeatIds = Set.of(8L, 9L);

        AppException ex = assertThrows(AppException.class, () -> validator.validate(seats, selectedSeatIds));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("A10"), "Error message should mention violated seat A10");
    }

    @Test
    @DisplayName("Case 4: Should ALLOW contiguous selection leaving 2+ empty seats")
    void testContiguousSelectionWithLargeGap_ShouldPass() {
        // Row A: A1, A2, A3 are BOOKED
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));

        // Customer selects A4 (id=4) and A5 (id=5) -> directly adjacent to booked A3!
        // Remaining seats A6..A10 (5 seats contiguous)
        Set<Long> selectedSeatIds = Set.of(4L, 5L);

        assertDoesNotThrow(() -> validator.validate(seats, selectedSeatIds));
    }

    @Test
    @DisplayName("Case 5: Should ALLOW selection leaving 2 empty seats (gap = 2)")
    void testLeavingGapOfTwo_ShouldPass() {
        // Row A: A1, A2, A3 are BOOKED
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2));

        // Customer selects A6 (id=6) and A7 (id=7)
        // Leaves A4, A5 (2 seats empty) and A8..A10 (3 seats empty)
        Set<Long> selectedSeatIds = Set.of(6L, 7L);

        assertDoesNotThrow(() -> validator.validate(seats, selectedSeatIds));
    }

    @Test
    @DisplayName("Case 6: Should ALLOW buying an already existing orphan seat")
    void testBuyingExistingOrphanSeat_ShouldPass() {
        // Row A: A1..A3 BOOKED, A4 AVAILABLE (already orphan), A5..A10 BOOKED
        List<SeatPosition> seats = createRow(0, 10, Set.of(0, 1, 2, 4, 5, 6, 7, 8, 9));

        // Customer buys the isolated seat A4 (id=4)
        Set<Long> selectedSeatIds = Set.of(4L);

        assertDoesNotThrow(() -> validator.validate(seats, selectedSeatIds));
    }

    @Test
    @DisplayName("Case 7: Should REJECT when aisle creates an isolated gap")
    void testAisleBoundary_ShouldReject() {
        // Row with an aisle: cols 0, 1, [aisle at col 2], cols 3, 4, 5, 6
        List<SeatPosition> seats = List.of(
                buildSeat(1L, "A1", 0, 0, SeatStatus.AVAILABLE),
                buildSeat(2L, "A2", 0, 1, SeatStatus.AVAILABLE),
                // col 2 is aisle
                buildSeat(4L, "A3", 0, 3, SeatStatus.AVAILABLE),
                buildSeat(5L, "A4", 0, 4, SeatStatus.AVAILABLE),
                buildSeat(6L, "A5", 0, 5, SeatStatus.AVAILABLE),
                buildSeat(7L, "A6", 0, 6, SeatStatus.AVAILABLE)
        );

        // Customer selects A2 (col 1). Leaves A1 (col 0) isolated between left wall and A2!
        Set<Long> selectedSeatIds = Set.of(2L);

        AppException ex = assertThrows(AppException.class, () -> validator.validate(seats, selectedSeatIds));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("A1"));
    }

    @Test
    @DisplayName("Case 8: Should ALLOW booking entire row")
    void testBookEntireRow_ShouldPass() {
        List<SeatPosition> seats = createRow(0, 5, Collections.emptySet());
        Set<Long> allSeats = Set.of(1L, 2L, 3L, 4L, 5L);

        assertDoesNotThrow(() -> validator.validate(seats, allSeats));
    }

    @Test
    @DisplayName("Case 9: Multi-row selection - one row violates -> Should REJECT")
    void testMultiRowSelectionWithOneViolatingRow_ShouldReject() {
        List<SeatPosition> rowA = createRow(0, 10, Collections.emptySet());
        List<SeatPosition> rowB = createRow(1, 10, Collections.emptySet());
        List<SeatPosition> allSeats = new ArrayList<>(rowA);
        allSeats.addAll(rowB);

        // Row A: selects A1, A2 (valid, starts at left wall)
        // Row B: selects B2, B3 (leaves B1 isolated at left wall!)
        // In rowB: B1=id 101, B2=id 102, B3=id 103
        Set<Long> selectedSeats = Set.of(1L, 2L, 102L, 103L);

        AppException ex = assertThrows(AppException.class, () -> validator.validate(allSeats, selectedSeats));
        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("B1"));
    }

    @Test
    @DisplayName("Case 10: Empty inputs should pass gracefully without errors")
    void testEmptyInputs_ShouldPassGracefully() {
        assertDoesNotThrow(() -> validator.validate(Collections.emptyList(), Set.of(1L)));
        assertDoesNotThrow(() -> validator.validate(createRow(0, 10, Collections.emptySet()), Collections.emptySet()));
    }
}
