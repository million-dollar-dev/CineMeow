package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.dto.response.PagedResponse;
import com.cinemeow.movie_service.entity.Genre;
import com.cinemeow.movie_service.entity.Movie;
import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.movie_service.mapper.MovieMapper;
import com.cinemeow.movie_service.repository.MovieRepository;
import com.cinemeow.movie_service.service.GenreService;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;


import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@ExtendWith(MockitoExtension.class)
public class MovieServiceImplTest {
    @Mock
    private MovieRepository movieRepository;

    @Mock
    private MovieMapper movieMapper;

    @Mock
    private GenreService genreService;

    @InjectMocks
    private MovieServiceImpl movieServiceImpl;

    private Movie movie;

    private MovieResponse movieResponse;

    @BeforeEach
    void setup() {
        this.movie = Movie.builder()
                .id("movie-1")
                .title("Movie 1")
                .build();
        this.movieResponse = MovieResponse.builder()
                .id("movie-1")
                .title("Movie 1")
                .build();
    }

    @Test
    public void testGetById_WhenExists_ReturnMovieResponse() {
        String id = "movie-1";

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));
        when(movieMapper.toMovieResponse(movie)).thenReturn(movieResponse);

        MovieResponse result = movieServiceImpl.getById(id);

        assertNotNull(result);
        assertEquals("movie-1", result.getId());
        assertEquals("Movie 1", result.getTitle());

        verify(movieRepository, times(1)).findById(id);
        verify(movieMapper, times(1)).toMovieResponse(movie);
    }

    @Test
    public void testGetById_WhenIdNotFound_ThrowAppException() {
        String id = "movie-2";

        when(movieRepository.findById(id)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> movieServiceImpl.getById(id));

        assertEquals(ErrorCode.MOVIE_NOT_FOUND, exception.getErrorCode());
        assertEquals(ErrorCode.MOVIE_NOT_FOUND.getMessage(), exception.getMessage());

        verify(movieMapper, never()).toMovieResponse(any());
    }

    @Test
    public void testCreateMovie_Success() {
        Genre genre1 = new Genre(1, "action");
        Genre genre2 = new Genre(2, "history");
        Set<Genre> genres = Set.of(genre1, genre2);
        this.movie.setDuration(123);
        this.movie.setGenres(genres);

        MovieResponse expectedResponse = MovieResponse.builder()
                .id("movie-1")
                .title("Movie 1")
                .genres(genres)
                .duration(123)
                .build();

        MovieRequest request = MovieRequest.builder()
                .title("Movie 1")
                .genres(Set.of(1, 2))
                .duration(123)
                .build();

        when(movieMapper.toMovie(request)).thenReturn(movie);
        when(genreService.findGenresByIds(Set.of(1, 2))).thenReturn(genres);
        when(movieRepository.save(movie)).thenReturn(movie);
        when(movieMapper.toMovieResponse(movie)).thenReturn(expectedResponse);

        MovieResponse result = movieServiceImpl.create(request);

        assertNotNull(result);
        assertEquals("movie-1", result.getId());
        assertEquals("Movie 1", result.getTitle());
        assertEquals(genres, result.getGenres());
        assertEquals(123, result.getDuration());

        verify(movieMapper, times(1)).toMovie(request);
        verify(genreService, times(1)).findGenresByIds(Set.of(1, 2));
        verify(movieRepository, times(1)).save(movie);
        verify(movieMapper, times(1)).toMovieResponse(movie);
    }

    @Test
    public void testGetAll_WhenMovieExist_ReturnList() {
        Movie movie1 = Movie.builder()
                .id("movie-1")
                .title("Movie 1")
                .duration(120)
                .build();
        Movie movie2 = Movie.builder()
                .id("movie-2")
                .title("Movie 2")
                .duration(121)
                .build();
        MovieResponse movieResponse1 = MovieResponse.builder()
                .id("movie-1")
                .title("Movie 1")
                .duration(120)
                .build();
        MovieResponse movieResponse2 = MovieResponse.builder()
                .id("movie-2")
                .title("Movie 2")
                .duration(121)
                .build();


        List<MovieResponse> expectedResponse = List.of(movieResponse1, movieResponse2);

        when(movieRepository.findAll()).thenReturn(List.of(movie1, movie2));
        when(movieMapper.toMovieResponse(movie1)).thenReturn(movieResponse1);
        when(movieMapper.toMovieResponse(movie2)).thenReturn(movieResponse2);

        List<MovieResponse> result = movieServiceImpl.getAll();

        assertThat(result)
                .hasSize(2)
                .isNotNull()
                .usingRecursiveComparison()
                .isEqualTo(expectedResponse);
    }

    @Test
    public void testGetAll_WhenNoMovieExist_ReturnEmptyList() {
        when(movieRepository.findAll()).thenReturn(Collections.emptyList());

        List<MovieResponse> result = movieServiceImpl.getAll();

        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("getMovies: sort correctly when sortBy is valid in the field:direction format")
    public void testGetMovies_WhenValidSortBy_BuildCorrectSort() {
        //Arrage
        int page = 1;
        int pageSize = 10;
        String sortBy = "title:asc";
        Page<Movie> emptyPage = new PageImpl<>(Collections.emptyList());

        when(movieRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

        //Act
        movieServiceImpl.getMovies(page, pageSize, sortBy);

        //Assert using captor
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(movieRepository).findAll(pageableCaptor.capture());
        Pageable capturedPageable = pageableCaptor.getValue();
        Sort capturedSort = capturedPageable.getSort();

        assertTrue(capturedSort.isSorted());
        Sort.Order order = capturedSort.getOrderFor("title");
        assertNotNull(order);
        assertEquals(Sort.Direction.ASC, order.getDirection());
    }

    @Test
    @DisplayName("getMovies: return unsort when soryBy is null or empty")
    public void testGetMovies_WhenEmptySortBy_ReturnUnSorted() {
        //Arrage
        int page = 1;
        int pageSize = 10;
        String sortBy = "";
        Page<Movie> emptyPage = new PageImpl<>(Collections.emptyList());

        when(movieRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

        //Act
        movieServiceImpl.getMovies(page, pageSize, sortBy);

        //Assert using captor
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(movieRepository).findAll(pageableCaptor.capture());
        Pageable capturedPageable = pageableCaptor.getValue();
        Sort capturedSort = capturedPageable.getSort();

        assertTrue(capturedSort.isUnsorted());
    }

    @Test
    @DisplayName("getMovies: return unsorted when sortBy is invalid")
    public void testGetMovies_WhenInvalidedSortBy_ReturnUnSorted() {
        //Arrage
        int page = 1;
        int pageSize = 10;
        String sortBy = "invalid_format";
        Page<Movie> emptyPage = new PageImpl<>(Collections.emptyList());

        when(movieRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

        //Act
        movieServiceImpl.getMovies(page, pageSize, sortBy);

        //Assert using captor
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(movieRepository).findAll(pageableCaptor.capture());
        Pageable capturedPageable = pageableCaptor.getValue();
        Sort capturedSort = capturedPageable.getSort();

        assertTrue(capturedSort.isUnsorted());
    }

    @Test
    public void testUpdate_ValidInput_Success() {
        // --- Arrange ---
        String id = "movie-1";
        Genre genre1 = new Genre(1, "action");
        Genre genre2 = new Genre(2, "history");
        Genre genre3 = new Genre(3, "romantic");
        Set<Genre> genres = Set.of(genre1, genre2);
        Set<Genre> updatedGenres = Set.of(genre3);
        this.movie.setDuration(123);
        this.movie.setGenres(genres);

        MovieRequest request = MovieRequest.builder()
                .title("updated title")
                .genres(Set.of(genre3.getId()))
                .build();

        MovieResponse expectedResponse = MovieResponse.builder()
                .id("movie-1")
                .title("updated title")
                .genres(updatedGenres)
                .duration(123)
                .build();

        when(movieRepository.findById(id)).thenReturn(Optional.of(movie));
        when(genreService.findGenresByIds(request.getGenres())).thenReturn(updatedGenres);
        doNothing().when(movieMapper).update(movie, request);
        when(movieRepository.save(movie)).thenReturn(movie);
        when(movieMapper.toMovieResponse(movie)).thenReturn(expectedResponse);

        // --- Act ---
        MovieResponse result = movieServiceImpl.update(id, request);

        // --- Assert ---
        assertAll(() -> {
            assertEquals("updated title", result.getTitle());
            assertEquals("movie-1", result.getId());
            assertEquals(123, result.getDuration());
            assertThat(result.getGenres()).isEqualTo(updatedGenres);
        });
        verify(movieRepository, times(1)).findById(id);
        verify(genreService, times(1)).findGenresByIds(request.getGenres());
        verify(movieMapper, times(1)).update(movie, request);
        verify(movieRepository, times(1)).save(movie);
        verify(movieMapper, times(1)).toMovieResponse(movie);
    }

    @Test
    public void testUpdate_WhenIdNotFound_ThrowsAppException() {
        String id = "unknown-id";
        MovieRequest request = MovieRequest.builder()
                .title("updated title")
                .genres(Set.of(1))
                .build();

        when(movieRepository.findById(id)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> movieServiceImpl.update(id, request));

        assertEquals(ErrorCode.MOVIE_NOT_FOUND.getMessage(), exception.getMessage());
        assertEquals(ErrorCode.MOVIE_NOT_FOUND.getStatusCode(), exception.getErrorCode().getStatusCode());

        verify(movieRepository, times(1)).findById(id);
        verify(genreService, never()).findGenresByIds(anySet());
        verify(movieRepository, never()).save(movie);
    }

    @Test
    public void testSearchMovies_WhenValidFilter_Success() {
        int pageNo = 0;
        int pageSize = 3;
        Pageable pageable = PageRequest.of(pageNo, pageSize);
        String[] filters = {"title~'avatar'", "duration>'120'"};

        Movie movie1 = Movie.builder().title("avatar 1").duration(121).build();
        Movie movie2 = Movie.builder().title("avatar 2").duration(132).build();
        MovieResponse movieResponse1 = MovieResponse.builder()
                .title("avatar 1")
                .duration(121)
                .build();
        MovieResponse movieResponse2 = MovieResponse.builder()
                .title("avatar 2")
                .duration(132)
                .build();
        List<MovieResponse> listMovieResponse = List.of(movieResponse1, movieResponse2);
        Page<Movie> page = new PageImpl<>(List.of(movie1, movie2), PageRequest.of(0, 3), 2);
        PagedResponse<List<MovieResponse>> expectedPage = PagedResponse.<List<MovieResponse>>builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalPages(1)
                .totalElements(2)
                .content(listMovieResponse)
                .build();

        when(movieRepository.findAll((Specification<Movie>) any(), eq(pageable))).thenReturn(page);
        when(movieMapper.toMovieResponse(movie1)).thenReturn(movieResponse1);
        when(movieMapper.toMovieResponse(movie2)).thenReturn(movieResponse2);

        PagedResponse<List<MovieResponse>> result = movieServiceImpl.searchMovies(pageable, filters);

        assertEquals(0, result.getPageNo());
        assertEquals(3, result.getPageSize());
        assertEquals(2, result.getTotalElements());
        assertThat(result).usingRecursiveComparison().isEqualTo(expectedPage);
    }

    @ParameterizedTest
    @NullAndEmptySource // Tự động test 2 lần: 1 lần với null, 1 lần với ""
    @ValueSource(strings = {
            "   ",               // Chuỗi toàn khoảng trắng
            "invalid_format",    // Sai định dạng
            "title",             // Thiếu :asc hoặc :desc
            "title:random",      // Direction không phải asc/desc
            ":asc"               // Thiếu tên trường
    })
    @DisplayName("getMovies: Trả về Sort.unsorted khi sortBy là null, rỗng hoặc sai định dạng")
    void testGetMovies_WhenSortByInvalidOrEmpty_ReturnsUnsorted(String invalidSortBy) {
        // 1. Arrange
        Page<Movie> emptyPage = new PageImpl<>(List.of());
        when(movieRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);
        // 2. Act
        movieServiceImpl.getMovies(1, 10, invalidSortBy);
        // 3. Assert
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(movieRepository).findAll(pageableCaptor.capture());
        assertTrue(pageableCaptor.getValue().getSort().isUnsorted());
    }

    @Test
    public void testSearchMovies_WhenNullFilter_SearchWithoutSpec() {
        Page<Movie> emptyPage = new PageImpl<>(List.of());
        Pageable pageable = PageRequest.of(0, 3);
        when(movieRepository.findAll(pageable)).thenReturn(emptyPage);

        PagedResponse<List<MovieResponse>> result = movieServiceImpl.searchMovies(pageable, null);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(movieRepository, times(1)).findAll(pageable);
    }

    @Test
    public void testSearchMovies_WhenFiltersInvalidOrEmptyValue_IgnoresThem() {
        Pageable pageable = PageRequest.of(0, 3);
        String[] filters = {"invalid_format", "title~''"};
        Page<Movie> emptyPage = new PageImpl<>(List.of());
        when(movieRepository.findAll((Specification<Movie>) isNull(), eq(pageable))).thenReturn(emptyPage);

        PagedResponse<List<MovieResponse>> result = movieServiceImpl.searchMovies(pageable, filters);

        assertNotNull(result);
        assertEquals(0, result.getTotalElements());
        verify(movieRepository, times(1)).findAll((Specification<Movie>) isNull(), eq(pageable));
    }

}

