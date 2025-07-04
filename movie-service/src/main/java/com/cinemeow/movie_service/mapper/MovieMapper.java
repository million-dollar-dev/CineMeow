package com.cinemeow.movie_service.mapper;

import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.entity.Movie;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    MovieResponse toMovieResponse(Movie movie);
    Movie toMovie(MovieResponse movieResponse);
}
