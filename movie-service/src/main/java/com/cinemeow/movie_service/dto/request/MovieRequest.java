package com.cinemeow.movie_service.dto.request;

import com.cinemeow.movie_service.enums.MovieRating;
import com.cinemeow.movie_service.enums.Status;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MovieRequest {
    @NotNull(message = "Rating is required")
    MovieRating rating;

    @NotBlank(message = "Backdrop path is required")
    @Pattern(regexp = "^/.*\\.jpg$", message = "Backdrop path must be a valid image path ending with .jpg")
    String backdropPath;

    @NotEmpty(message = "At least one genre is required")
    Set<Integer> genres;

    @NotEmpty(message = "At least one origin country is required")
    String originCountry;

    @NotBlank(message = "Original language is required")
    @Size(min = 2, max = 3, message = "Original language must be 2-3 characters")
    String originalLanguage;

    @NotBlank(message = "Overview is required")
    @Size(min = 10, max = 1000, message = "Overview must be between 10 and 1000 characters")
    String overview;

    @NotBlank(message = "Poster path is required")
    @Pattern(regexp = "^/.*\\.jpg$", message = "Poster path must be a valid image path ending with .jpg")
    String posterPath;

    @NotNull(message = "Release date is required")
    LocalDate releaseDate;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 minute")
    Integer duration;

    @NotNull(message = "Status is required")
    Status status;

    @NotBlank(message = "Tagline is required")
    @Size(max = 200, message = "Tagline must be less than 200 characters")
    String tagline;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    String title;

    @NotBlank(message = "Subtitle is required")
    @Size(min = 2, max = 10, message = "Subtitle must be between 2 and 10 characters")
    String subtitle;

    @NotBlank(message = "Director must not be blank")
    @Size(max = 100, message = "Director name must not exceed 100 characters")
    String director;

    @NotEmpty(message = "Casts list must not be empty")
    @Size(max = 20, message = "Casts list must not exceed 20 members")
    List<String> casts;
}
