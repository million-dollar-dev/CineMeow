package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.entity.Genre;
import com.cinemeow.movie_service.entity.Movie;
import com.cinemeow.movie_service.exception.AppException;
import com.cinemeow.movie_service.exception.ErrorCode;
import com.cinemeow.movie_service.mapper.MovieMapper;
import com.cinemeow.movie_service.repository.MovieRepository;
import com.cinemeow.movie_service.service.GenreService;
import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


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
    @DisplayName("getMovies: return unsort when sortBy is invalid")
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


}
