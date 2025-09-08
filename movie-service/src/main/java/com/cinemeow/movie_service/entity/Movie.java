package com.cinemeow.movie_service.entity;

import com.cinemeow.movie_service.enums.MovieRating;
import com.cinemeow.movie_service.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Enumerated(EnumType.STRING)
    @Column(name = "rating", nullable = false)
    MovieRating rating;

    @Column(name = "backdrop_path")
    String backdropPath;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @Builder.Default
    Set<Genre> genres = new HashSet<>();

    @Column(name = "country")
    String originCountry;

    @Column(name = "original_language")
    String originalLanguage;

    @Column(name = "overview", columnDefinition = "TEXT")
    String overview;

    @Column(name = "poster_path")
    String posterPath;

    @Column(name = "trailer_url")
    String trailerUrl;

    @Column(name = "release_date", nullable = false)
    LocalDate releaseDate;

    @Column(name = "duration")
    Integer duration;

    @Column(name = "status", nullable = false)
    Status status;

    @Column(name = "tagline")
    String tagline;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "subtitle")
    String subtitle;

    @Column(name = "director")
    String director;

    @ElementCollection
    @CollectionTable(
            name = "movie_casts",
            joinColumns = @JoinColumn(name = "movie_id"))
    @Column(name = "casts")
    List<String> casts;
}
