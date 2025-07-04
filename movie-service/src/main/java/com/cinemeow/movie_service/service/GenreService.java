package com.cinemeow.movie_service.service;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GenreService {
    GenreResponse create(GenreRequest request);
    List<GenreResponse> getAll();
    void deleteById(Integer id);
}
