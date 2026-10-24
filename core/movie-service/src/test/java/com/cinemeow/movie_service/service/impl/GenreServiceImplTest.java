package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.entity.Genre;
import com.cinemeow.movie_service.exception.AppException;
import com.cinemeow.movie_service.exception.ErrorCode;
import com.cinemeow.movie_service.mapper.GenreMapper;
import com.cinemeow.movie_service.repository.GenreRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.assertj.core.api.Assertions.assertThat;


@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class GenreServiceImplTest {
    @Mock
    GenreRepository genreRepository;

    @Mock
    GenreMapper genreMapper;

    @InjectMocks
    GenreServiceImpl genreService;

    GenreResponse genreResponse;

    Genre genre;

    @BeforeEach
    void setup() {
        this.genre = Genre.builder()
                .id(1)
                .name("genre 1")
                .build();
        this.genreResponse = GenreResponse.builder()
                .id(1)
                .name("genre 1")
                .build();
    }

    @Test
    public void testCreate_Successful() {
        int id = 1;
        String name = "genre 1";
        GenreRequest request = new GenreRequest(name);
        when(genreMapper.toGenre(request)).thenReturn(this.genre);
        when(genreRepository.save(genre)).thenReturn(this.genre);
        when(genreMapper.toGenreResponse(genre)).thenReturn(this.genreResponse);

        GenreResponse result = genreService.create(request);

        assertNotNull(request);
        assertEquals(id, result.getId());
        assertEquals(name, result.getName());
        verify(genreRepository).save(genre);
    }

    @Test
    public void testGetAll_WhenGenresExist_ReturnList() {
        int id1 = 1;
        String name1 = "genre 1";
        Genre genre1 = new Genre(id1, name1);
        int id2 = 2;
        String name2 = "genre 2";
        Genre genre2 = new Genre(id2, name2);
        List<Genre> genreList = List.of(genre1, genre2);

        GenreResponse genreResponse1 = new GenreResponse(id1, name1);
        GenreResponse genreResponse2 = new GenreResponse(id2, name2);
        List<GenreResponse> genreResponseList = List.of(genreResponse1, genreResponse2);

        when(genreRepository.findAll()).thenReturn(genreList);
        when(genreMapper.toGenreResponse(genre1)).thenReturn(genreResponse1);
        when(genreMapper.toGenreResponse(genre2)).thenReturn(genreResponse2);

        List<GenreResponse> result = genreService.getAll();

        assertEquals(2, result.size());
        assertThat(result).usingRecursiveComparison().isEqualTo(genreResponseList);
        verify(genreRepository).findAll();
        verify(genreMapper, times(2)).toGenreResponse(any());
    }

    @Test
    public void testGetAll_NoGenreExists_ReturnEmptyList() {
        when(genreRepository.findAll()).thenReturn(List.of());

        List<GenreResponse> result = genreService.getAll();

        assertTrue(result.isEmpty());
        verify(genreRepository).findAll();
        verify(genreMapper, never()).toGenreResponse(any());
    }

    @Test
    public void testDelete_GenreExists_Successful() {
        int id = 1;
        when(genreRepository.findById(id)).thenReturn(Optional.of(this.genre));
        doNothing().when(genreRepository).delete(genre);

        genreService.deleteById(id);

        verify(genreRepository).findById(id);
        verify(genreRepository).delete(this.genre);
    }

    @Test
    public void testDelete_GenreNonExists_ThrowsAppException() {
        int id = 999;
        when(genreRepository.findById(id)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> genreService.deleteById(id));

        assertEquals(ErrorCode.GENRE_NOT_FOUND.getCode(), exception.getErrorCode().getCode());
        assertEquals(ErrorCode.GENRE_NOT_FOUND.getMessage(), exception.getMessage());
        verify(genreRepository).findById(id);
        verify(genreRepository, never()).delete(any());
    }

    @Test
    public void testFindGenresByIds_whenInvalidInput_ReturnSet() {
        Set<Integer> request = Set.of(1, 2, 3, 4);
        int id1 = 1;
        String name1 = "genre 1";
        Genre genre1 = new Genre(id1, name1);
        int id2 = 2;
        String name2 = "genre 2";
        Genre genre2 = new Genre(id2, name2);
        Set<Genre> genreSet = Set.of(genre1, genre2);
        List<Genre> genreList = genreSet.stream().toList();

        when(genreRepository.findAllById(request)).thenReturn(genreList);

        Set<Genre> result = genreService.findGenresByIds(request);

        assertEquals(2, result.size());
        assertThat(result).usingRecursiveAssertion().isEqualTo(genreSet);
        verify(genreRepository).findAllById(request);
    }

    @ParameterizedTest
    @NullAndEmptySource
    public void testFindGenresByIds_WhenNullOrEmptyRequest_ReturnEmptySet(Set<Integer> request) {
        Set<Genre> result = genreService.findGenresByIds(request);

        assertTrue(result.isEmpty());
        verify(genreRepository, never()).findAllById(request);
    }
}