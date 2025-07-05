package com.cinemeow.movie_service.mapper;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieResponse toMovieResponse(Movie movie);
    Movie toMovie(MovieRequest request);
    void update(@MappingTarget Movie movie, MovieRequest request);
}
