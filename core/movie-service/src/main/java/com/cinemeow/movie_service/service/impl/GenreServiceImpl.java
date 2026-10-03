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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GenreServiceImpl implements GenreService {
    GenreRepository genreRepository;
    GenreMapper genreMapper;


    @Override
    @CacheEvict(value = "genres", key = "'all'")
    public GenreResponse create(GenreRequest request) {
        Genre genre = genreMapper.toGenre(request);
        return genreMapper.toGenreResponse(genreRepository.save(genre));
    }

    @Override
    @Cacheable(value = "genres", key = "'all'")
    public List<GenreResponse> getAll() {
        return genreRepository.findAll().stream()
                .map(genreMapper::toGenreResponse)
                .toList();
    }

    @Override
    @Caching(
            evict = {
                    @CacheEvict(value = "genre", key = "#id"),
                    @CacheEvict(value = "genres", key = "'all'")
            }
    )
    public void deleteById(Integer id) {
        genreRepository.deleteById(id);
    }

    @Override
    public Set<Genre> findGenresByIds(Set<Integer> ids) {
        if (ids == null || ids.size() == 0)
            return Collections.emptySet();
        List<Genre> genres = genreRepository.findAllById(ids);
        return new HashSet<>(genres);
    }
}
