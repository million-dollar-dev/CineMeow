package com.cinemeow.movie_service.service;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.entity.Genre;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public interface GenreService {
    GenreResponse create(GenreRequest request);
    List<GenreResponse> getAll();
    void deleteById(Integer id);
    Set<Genre> findGenresByIds(Set<Integer> ids);
}
