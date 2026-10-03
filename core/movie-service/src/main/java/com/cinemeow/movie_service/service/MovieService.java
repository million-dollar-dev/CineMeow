package com.cinemeow.movie_service.service;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.dto.response.PagedResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MovieService {
    MovieResponse create(MovieRequest request);
    MovieResponse getById(String id);
    List<MovieResponse> getAll();
    PagedResponse<List<MovieResponse>> getMovies(int pageNo, int pageSize, String sortBy);
    MovieResponse update(String id, MovieRequest request);
    PagedResponse<List<MovieResponse>> searchMovies(Pageable pageable, String[] filters);
}
