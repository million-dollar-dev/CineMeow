package com.cinemeow.movie_service.dto.response;

import com.cinemeow.movie_service.entity.Genre;
import com.cinemeow.movie_service.enums.MovieRating;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
    String id;
    MovieRating rating;
    String backdropPath;
    Set<Genre> genres;
    String originCountry;
    String originalLanguage;
    String overview;
    String posterPath;
    LocalDate releaseDate;
    Integer duration;
    String status;
    String tagline;
    String title;
    String subtitle;
}
