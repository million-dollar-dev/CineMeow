package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.entity.Genre;
import com.cinemeow.movie_service.mapper.GenreMapper;
import com.cinemeow.movie_service.repository.GenreRepository;
import com.cinemeow.movie_service.service.GenreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreServiceImpl implements GenreService {
    GenreRepository genreRepository;
    GenreMapper genreMapper;

    @Override
    public GenreResponse create(GenreRequest request) {
        Genre genre = genreMapper.toGenre(request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Override
    public List<GenreResponse> getAll() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    @Override
    public void deleteById(Integer id) {
        genreRepository.deleteById(id);
    }
}
