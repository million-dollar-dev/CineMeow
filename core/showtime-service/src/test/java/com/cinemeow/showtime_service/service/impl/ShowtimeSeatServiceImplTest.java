package com.cinemeow.showtime_service.service.impl;

import com.cinemeow.cinema_service.dto.response.SeatMapResponse;
import com.cinemeow.cinema_service.dto.response.SeatResponse;
import com.cinemeow.cinema_service.enums.SeatStatus;
import com.cinemeow.cinema_service.enums.SeatType;
import com.cinemeow.cinema_service.service.RoomService;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.entity.ShowtimeSeat;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.repository.ShowtimeSeatRepository;
import com.cinemeow.showtime_service.validator.SeatGapValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ShowtimeSeatServiceImpl Unit Tests with Gap Validator")
class ShowtimeSeatServiceImplTest {

    @Mock
    private ShowtimeSeatRepository showtimeSeatRepository;

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private RoomService roomService;

    private SeatGapValidator seatGapValidator;
    private ShowtimeSeatServiceImpl showtimeSeatService;

    @BeforeEach
    void setUp() {
        seatGapValidator = new SeatGapValidator();
        showtimeSeatService = new ShowtimeSeatServiceImpl(
                showtimeSeatRepository,
                showtimeRepository,
                roomService,
                seatGapValidator
        );
    }

    private SeatMapResponse createMockSeatMap() {
        // Row 0 has 5 seats: A1 (0), A2 (1), A3 (2), A4 (3), A5 (4)
        List<SeatResponse> seats = List.of(
                SeatResponse.builder().id(1L).label("A1").rowIndex(0).colIndex(0).type(SeatType.NORMAL).status(SeatStatus.AVAILABLE).build(),
                SeatResponse.builder().id(2L).label("A2").rowIndex(0).colIndex(1).type(SeatType.NORMAL).status(SeatStatus.AVAILABLE).build(),
                SeatResponse.builder().id(3L).label("A3").rowIndex(0).colIndex(2).type(SeatType.NORMAL).status(SeatStatus.AVAILABLE).build(),
                SeatResponse.builder().id(4L).label("A4").rowIndex(0).colIndex(3).type(SeatType.NORMAL).status(SeatStatus.AVAILABLE).build(),
                SeatResponse.builder().id(5L).label("A5").rowIndex(0).colIndex(4).type(SeatType.NORMAL).status(SeatStatus.AVAILABLE).build()
        );
        return SeatMapResponse.builder().seats(seats).build();
    }

    @Test
    @DisplayName("checkAvailableSeats should reject selection leaving 1 isolated gap at left wall")
    void checkAvailableSeats_ViolatesGapRule_ThrowsAppException() {
        String showtimeId = "st-101";
        String roomId = "room-1";

        Showtime showtime = Showtime.builder().id(showtimeId).roomId(roomId).build();
        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.of(showtime));
        when(roomService.getSeatMap(roomId)).thenReturn(createMockSeatMap());

        // Available seats: A1..A5
        List<ShowtimeSeat> availableSeats = List.of(
                ShowtimeSeat.builder().id(11L).seatId(1L).showtimeId(showtimeId).label("A1").status(SeatStatus.AVAILABLE).build(),
                ShowtimeSeat.builder().id(12L).seatId(2L).showtimeId(showtimeId).label("A2").status(SeatStatus.AVAILABLE).build(),
                ShowtimeSeat.builder().id(13L).seatId(3L).showtimeId(showtimeId).label("A3").status(SeatStatus.AVAILABLE).build()
        );

        when(showtimeSeatRepository.findBySeatIdInAndStatusAndShowtimeId(List.of(2L, 3L), SeatStatus.AVAILABLE, showtimeId))
                .thenReturn(List.of(availableSeats.get(1), availableSeats.get(2)));
        when(showtimeSeatRepository.findAllByShowtimeId(showtimeId)).thenReturn(availableSeats);

        // Selecting A2, A3 leaves A1 alone against left wall
        AppException ex = assertThrows(AppException.class,
                () -> showtimeSeatService.checkAvailableSeats(showtimeId, List.of(2L, 3L)));

        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        assertTrue(ex.getMessage().contains("A1"));
    }

    @Test
    @DisplayName("checkAvailableSeats should pass when selection is contiguous with wall")
    void checkAvailableSeats_ValidSelection_Success() {
        String showtimeId = "st-101";
        String roomId = "room-1";

        Showtime showtime = Showtime.builder().id(showtimeId).roomId(roomId).build();
        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.of(showtime));
        when(roomService.getSeatMap(roomId)).thenReturn(createMockSeatMap());

        List<ShowtimeSeat> availableSeats = List.of(
                ShowtimeSeat.builder().id(11L).seatId(1L).showtimeId(showtimeId).label("A1").status(SeatStatus.AVAILABLE).build(),
                ShowtimeSeat.builder().id(12L).seatId(2L).showtimeId(showtimeId).label("A2").status(SeatStatus.AVAILABLE).build()
        );

        when(showtimeSeatRepository.findBySeatIdInAndStatusAndShowtimeId(List.of(1L, 2L), SeatStatus.AVAILABLE, showtimeId))
                .thenReturn(availableSeats);
        when(showtimeSeatRepository.findAllByShowtimeId(showtimeId)).thenReturn(availableSeats);

        // Selecting A1, A2 leaves A3, A4, A5 (3 seats) empty -> allowed!
        List<ShowtimeSeat> result = showtimeSeatService.checkAvailableSeats(showtimeId, List.of(1L, 2L));
        assertEquals(2, result.size());
    }

    @Test
    @DisplayName("lockSeats should reject when gap rule is violated")
    void lockSeats_ViolatesGapRule_ThrowsAppException() {
        String showtimeId = "st-101";
        String roomId = "room-1";

        Showtime showtime = Showtime.builder().id(showtimeId).roomId(roomId).build();
        when(showtimeRepository.findById(showtimeId)).thenReturn(Optional.of(showtime));
        when(roomService.getSeatMap(roomId)).thenReturn(createMockSeatMap());

        List<ShowtimeSeat> seatsToLock = List.of(
                ShowtimeSeat.builder().id(12L).seatId(2L).showtimeId(showtimeId).label("A2").status(SeatStatus.AVAILABLE).build(),
                ShowtimeSeat.builder().id(13L).seatId(3L).showtimeId(showtimeId).label("A3").status(SeatStatus.AVAILABLE).build()
        );

        when(showtimeSeatRepository.findAllByIdIn(List.of(12L, 13L))).thenReturn(seatsToLock);
        when(showtimeSeatRepository.findAllByShowtimeId(showtimeId)).thenReturn(seatsToLock);

        AppException ex = assertThrows(AppException.class,
                () -> showtimeSeatService.lockSeats(List.of(12L, 13L)));

        assertEquals(ErrorCode.SEAT_SINGLE_GAP_VIOLATED, ex.getErrorCode());
        verify(showtimeSeatRepository, never()).saveAll(any());
    }
}
