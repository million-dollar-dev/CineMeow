package com.cinemeow.booking_service.validator;

import com.cinemeow.booking_service.dto.response.SeatResponse;
import com.cinemeow.booking_service.enums.SeatStatus;
import com.cinemeow.booking_service.enums.SeatType;
import com.cinemeow.booking_service.exception.AppException;
import com.cinemeow.booking_service.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CoupleSeatValidator Unit Tests (Sweetbox Atomic Constraint Rule - CM-000008)")
class CoupleSeatValidatorTest {

    private CoupleSeatValidator validator;
    
    private Map<Long, SeatResponse> physicalSeatMap;

    @BeforeEach
    void setUp() {
        validator = new CoupleSeatValidator();
        physicalSeatMap = new HashMap<>();

        // Couple Pair 1: H1 (id: 81) <-> H2 (id: 82)
        physicalSeatMap.put(81L, SeatResponse.builder()
                .id(81L)
                .label("H1")
                .rowIndex(7)
                .colIndex(0)
                .type(SeatType.COUPLE)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(82L)
                .build());

        physicalSeatMap.put(82L, SeatResponse.builder()
                .id(82L)
                .label("H2")
                .rowIndex(7)
                .colIndex(1)
                .type(SeatType.COUPLE)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(81L)
                .build());

        // Couple Pair 2: H3 (id: 83) <-> H4 (id: 84)
        physicalSeatMap.put(83L, SeatResponse.builder()
                .id(83L)
                .label("H3")
                .rowIndex(7)
                .colIndex(2)
                .type(SeatType.COUPLE)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(84L)
                .build());

        physicalSeatMap.put(84L, SeatResponse.builder()
                .id(84L)
                .label("H4")
                .rowIndex(7)
                .colIndex(3)
                .type(SeatType.COUPLE)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(83L)
                .build());

        // Normal Seats: H5 (id: 85), H6 (id: 86)
        physicalSeatMap.put(85L, SeatResponse.builder()
                .id(85L)
                .label("H5")
                .rowIndex(7)
                .colIndex(4)
                .type(SeatType.NORMAL)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(null)
                .build());

        physicalSeatMap.put(86L, SeatResponse.builder()
                .id(86L)
                .label("H6")
                .rowIndex(7)
                .colIndex(5)
                .type(SeatType.NORMAL)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(null)
                .build());
    }

    @Test
    @DisplayName("TC-01: Valid - Selecting both seats of Sweetbox pair [H1, H2]")
    void testValidCouplePairSelection_ShouldPass() {
        List<Long> requestedSeatIds = List.of(81L, 82L);
        assertDoesNotThrow(() -> validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap));
    }

    @Test
    @DisplayName("TC-02: Invalid - Selecting only H1 without paired seat H2")
    void testSingleCoupleSeatH1Only_ShouldThrowIncompleteException() {
        List<Long> requestedSeatIds = List.of(81L);
        AppException ex = assertThrows(AppException.class, () ->
                validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap)
        );

        assertEquals(ErrorCode.SEAT_COUPLE_PAIR_INCOMPLETE, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("H1"));
        assertTrue(ex.getMessage().contains("H2"));
    }

    @Test
    @DisplayName("TC-03: Invalid - Selecting only H2 without paired seat H1")
    void testSingleCoupleSeatH2Only_ShouldThrowIncompleteException() {
        List<Long> requestedSeatIds = List.of(82L);
        AppException ex = assertThrows(AppException.class, () ->
                validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap)
        );

        assertEquals(ErrorCode.SEAT_COUPLE_PAIR_INCOMPLETE, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("H2"));
        assertTrue(ex.getMessage().contains("H1"));
    }

    @Test
    @DisplayName("TC-04: Valid - Selecting two complete pairs [H1, H2, H3, H4]")
    void testTwoCompletePairs_ShouldPass() {
        List<Long> requestedSeatIds = List.of(81L, 82L, 83L, 84L);
        assertDoesNotThrow(() -> validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap));
    }

    @Test
    @DisplayName("TC-05: Invalid - Pair H1-H2 complete, but H3-H4 missing H4")
    void testOneCompleteAndOneIncompletePair_ShouldThrowIncompleteException() {
        List<Long> requestedSeatIds = List.of(81L, 82L, 83L);
        AppException ex = assertThrows(AppException.class, () ->
                validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap)
        );

        assertEquals(ErrorCode.SEAT_COUPLE_PAIR_INCOMPLETE, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("H3"));
        assertTrue(ex.getMessage().contains("H4"));
    }

    @Test
    @DisplayName("TC-06: Valid - Selecting one complete pair and two normal seats [H1, H2, H5, H6]")
    void testCouplePairWithNormalSeats_ShouldPass() {
        List<Long> requestedSeatIds = List.of(81L, 82L, 85L, 86L);
        assertDoesNotThrow(() -> validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap));
    }

    @Test
    @DisplayName("TC-07: Invalid - Sweetbox seat with missing pair reference (null pairSeatId)")
    void testMisconfiguredCoupleSeat_ShouldThrowInvalidSeatException() {
        physicalSeatMap.put(99L, SeatResponse.builder()
                .id(99L)
                .label("H99")
                .rowIndex(7)
                .colIndex(10)
                .type(SeatType.COUPLE)
                .status(SeatStatus.AVAILABLE)
                .pairSeatId(null)
                .build());

        List<Long> requestedSeatIds = List.of(99L);
        AppException ex = assertThrows(AppException.class, () ->
                validator.validateCoupleSeats(requestedSeatIds, physicalSeatMap)
        );

        assertEquals(ErrorCode.INVALID_SEAT, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("misconfigured"));
    }

    @Test
    @DisplayName("TC-08: Valid - Empty or normal seats only should pass validation")
    void testEmptyOrNormalSeatsOnly_ShouldPass() {
        // Empty list
        assertDoesNotThrow(() -> validator.validateCoupleSeats(Collections.emptyList(), physicalSeatMap));
        assertDoesNotThrow(() -> validator.validateCoupleSeats(null, physicalSeatMap));

        // Normal seats only
        List<Long> requestedNormal = List.of(85L, 86L);
        assertDoesNotThrow(() -> validator.validateCoupleSeats(requestedNormal, physicalSeatMap));
    }
}
