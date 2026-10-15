package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.entity.Movie;
import com.cinemeow.movie_service.exception.AppException;
import com.cinemeow.movie_service.exception.ErrorCode;
import com.cinemeow.movie_service.mapper.MovieMapper;
import com.cinemeow.movie_service.repository.MovieRepository;
import com.cinemeow.movie_service.service.GenreService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;


import java.util.Optional;

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
        assertEquals("Movie 1", movie.getTitle());

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


}
