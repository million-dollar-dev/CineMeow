package com.cinemeow.movie_service.mapper;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.entity.Genre;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    Genre toGenre(GenreRequest request);
    GenreResponse toGenreResponse(Genre genre);
}
