package com.cinemeow.showtime_service.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieResponse {
    String id;
    String backdropPath;
    String originCountry;
    String originalLanguage;
    String overview;
    String posterPath;
    String trailerUrl;
    LocalDate releaseDate;
    Integer duration;
    String status;
    String tagline;
    String title;
}
