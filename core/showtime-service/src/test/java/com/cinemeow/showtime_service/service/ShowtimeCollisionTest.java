package com.cinemeow.showtime_service.service;

import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.service.RoomService;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.service.MovieService;
import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.entity.Showtime;
import com.cinemeow.showtime_service.enums.ShowtimeStatus;
import com.cinemeow.showtime_service.mapper.ShowtimeMapper;
import com.cinemeow.showtime_service.repository.ShowtimeRepository;
import com.cinemeow.showtime_service.service.impl.ShowtimeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Showtime Collision & Transition Buffer Unit Tests (CM-000007)")
class ShowtimeCollisionTest {

    @Mock
    private ShowtimeRepository showtimeRepository;

    @Mock
    private ShowtimeMapper showtimeMapper;

    @Mock
    private MovieService movieService;

    @Mock
    private RoomService roomService;

    @InjectMocks
    private ShowtimeServiceImpl showtimeService;

    private static final String ROOM_1 = "room-01";
    private static final String ROOM_2 = "room-02";
    private static final String MOVIE_1 = "movie-avatar";

    // Existing Showtime S1: 19:00 - 21:00 (Buffer 15m -> Effective end: 21:15)
    private Showtime existingShowtimeS1;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(showtimeService, "defaultBufferMinutes", 15);

        existingShowtimeS1 = Showtime.builder()
                .id("showtime-s1")
                .movieId(MOVIE_1)
                .roomId(ROOM_1)
                .startTime(LocalDateTime.of(2026, 12, 1, 19, 0))
                .endTime(LocalDateTime.of(2026, 12, 1, 21, 0))
                .transitionBufferMinutes(15)
                .effectiveEndTime(LocalDateTime.of(2026, 12, 1, 21, 15))
                .status(ShowtimeStatus.AVAILABLE)
                .build();
    }

    private ShowtimeRequest buildRequest(String roomId, LocalDateTime start, LocalDateTime end) {
        return ShowtimeRequest.builder()
                .movieId(MOVIE_1)
                .roomId(roomId)
                .startTime(start)
                .endTime(end)
                .status(ShowtimeStatus.AVAILABLE)
                .build();
    }

    private void mockSuccessfulSaveAndResponse(ShowtimeRequest request) {
        Showtime mapped = Showtime.builder()
                .id("showtime-new")
                .movieId(request.getMovieId())
                .roomId(request.getRoomId())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(request.getStatus())
                .build();

        when(showtimeMapper.toShowtime(request)).thenReturn(mapped);
        when(showtimeMapper.toShowtimeResponse(any(Showtime.class))).thenReturn(
                ShowtimeResponse.builder().id("showtime-new").build()
        );
        when(movieService.getById(anyString())).thenReturn(
                MovieResponse.builder().title("Avatar").build()
        );
        when(roomService.getById(anyString())).thenReturn(
                RoomResponse.builder().name("Room 01").cinemaId("c1").build()
        );
    }

    @Test
    @DisplayName("KB-01: Valid - S2 ends at 18:45 + 15m buffer = 19:00, exactly when S1 starts")
    void testKB01_AdjacentBefore_ShouldPass() {
        // S2: 17:00 - 18:45 -> effective end: 19:00
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 17, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 18, 45);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.empty());

        mockSuccessfulSaveAndResponse(request);

        ShowtimeResponse response = showtimeService.create(request);
        assertNotNull(response);
        verify(showtimeRepository).save(any(Showtime.class));
    }

    @Test
    @DisplayName("KB-02: Collision - S2 ends at 18:50 + 15m buffer = 19:05, intruding 5m into S1 buffer")
    void testKB02_BufferOverlap_ShouldThrowCollisionException() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 17, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 18, 50);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.of(existingShowtimeS1));

        AppException ex = assertThrows(AppException.class, () -> showtimeService.create(request));
        assertEquals(ErrorCode.SHOWTIME_OVERLAPPED, ex.getErrorCode());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    @DisplayName("KB-03: Collision - S2 runs 20:00 - 22:00, directly overlapping S1 showtime (19:00 - 21:00)")
    void testKB03_DirectOverlap_ShouldThrowCollisionException() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 20, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 22, 0);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.of(existingShowtimeS1));

        AppException ex = assertThrows(AppException.class, () -> showtimeService.create(request));
        assertEquals(ErrorCode.SHOWTIME_OVERLAPPED, ex.getErrorCode());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    @DisplayName("KB-04: Collision - S2 runs 19:30 - 20:30, completely nested inside S1")
    void testKB04_NestedInside_ShouldThrowCollisionException() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 19, 30);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 20, 30);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.of(existingShowtimeS1));

        AppException ex = assertThrows(AppException.class, () -> showtimeService.create(request));
        assertEquals(ErrorCode.SHOWTIME_OVERLAPPED, ex.getErrorCode());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    @DisplayName("KB-05: Collision - S2 runs 18:00 - 22:00, completely encompassing S1")
    void testKB05_Encompassing_ShouldThrowCollisionException() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 18, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 22, 0);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.of(existingShowtimeS1));

        AppException ex = assertThrows(AppException.class, () -> showtimeService.create(request));
        assertEquals(ErrorCode.SHOWTIME_OVERLAPPED, ex.getErrorCode());
        verify(showtimeRepository, never()).save(any());
    }

    @Test
    @DisplayName("KB-06: Valid - S2 starts at 21:15, exactly after S1 effective end (21:15)")
    void testKB06_AdjacentAfter_ShouldPass() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 21, 15);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 23, 0);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.empty());

        mockSuccessfulSaveAndResponse(request);

        ShowtimeResponse response = showtimeService.create(request);
        assertNotNull(response);
        verify(showtimeRepository).save(any(Showtime.class));
    }

    @Test
    @DisplayName("KB-07: Valid - Same time frame 20:00 - 22:00 but in a different room (Room 2)")
    void testKB07_DifferentRoom_ShouldPass() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 20, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 22, 0);
        ShowtimeRequest request = buildRequest(ROOM_2, start, end);

        when(showtimeRepository.findConflictingShowtime(eq(ROOM_2), eq(start), eq(end.plusMinutes(15)), anyString(), isNull()))
                .thenReturn(Optional.empty());

        mockSuccessfulSaveAndResponse(request);

        ShowtimeResponse response = showtimeService.create(request);
        assertNotNull(response);
        verify(showtimeRepository).save(any(Showtime.class));
    }

    @Test
    @DisplayName("KB-08: Layer 2 Defense - Database Exclusion Constraint violation raises 409 Overlapped")
    void testLayer2_ExclusionConstraintViolation_ShouldThrowOverlappedException() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 20, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 22, 0);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        // Layer 1 passes (simulating concurrent insert race condition)
        when(showtimeRepository.findConflictingShowtime(any(), any(), any(), any(), any()))
                .thenReturn(Optional.empty());

        Showtime mapped = Showtime.builder().id("s-concurrent").build();
        when(showtimeMapper.toShowtime(request)).thenReturn(mapped);

        // Layer 2 triggers: Postgres 23P01 exclusion violation
        when(showtimeRepository.save(any(Showtime.class)))
                .thenThrow(new DataIntegrityViolationException("ERROR: conflicting key value violates exclusion constraint \"exclude_overlapping_showtimes\" (23P01)"));

        AppException ex = assertThrows(AppException.class, () -> showtimeService.create(request));
        assertEquals(ErrorCode.SHOWTIME_OVERLAPPED, ex.getErrorCode());
    }

    @Test
    @DisplayName("Self-Update Check: Updating a showtime excludes itself from collision check")
    void testUpdate_ExcludeSelfFromConflictCheck() {
        LocalDateTime start = LocalDateTime.of(2026, 12, 1, 19, 0);
        LocalDateTime end = LocalDateTime.of(2026, 12, 1, 21, 30);
        ShowtimeRequest request = buildRequest(ROOM_1, start, end);

        when(showtimeRepository.findById("showtime-s1")).thenReturn(Optional.of(existingShowtimeS1));

        // Conflict check receives excludeId = "showtime-s1"
        when(showtimeRepository.findConflictingShowtime(eq(ROOM_1), eq(start), eq(end.plusMinutes(15)), anyString(), eq("showtime-s1")))
                .thenReturn(Optional.empty());

        when(showtimeMapper.toShowtimeResponse(any(Showtime.class))).thenReturn(
                ShowtimeResponse.builder().id("showtime-s1").build()
        );
        when(movieService.getById(anyString())).thenReturn(MovieResponse.builder().title("Avatar").build());
        when(roomService.getById(anyString())).thenReturn(RoomResponse.builder().name("Room 01").build());

        ShowtimeResponse response = showtimeService.updateById("showtime-s1", request);
        assertNotNull(response);
        verify(showtimeMapper).update(existingShowtimeS1, request);
        verify(showtimeRepository).save(existingShowtimeS1);
    }
}
