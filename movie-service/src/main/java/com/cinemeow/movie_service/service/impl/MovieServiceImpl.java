package com.cinemeow.movie_service.service.impl;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.dto.response.PagedResponse;
import com.cinemeow.movie_service.entity.Movie;
import com.cinemeow.movie_service.exception.AppException;
import com.cinemeow.movie_service.exception.ErrorCode;
import com.cinemeow.movie_service.mapper.MovieMapper;
import com.cinemeow.movie_service.repository.MovieRepository;
import com.cinemeow.movie_service.repository.specification.MovieSpecificationBuilder;
import com.cinemeow.movie_service.service.GenreService;
import com.cinemeow.movie_service.service.MovieService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class MovieServiceImpl implements MovieService {
    MovieRepository movieRepository;
    MovieMapper movieMapper;
    GenreService genreService;

    @Override
    @CacheEvict(value = "movies", key = "'all'")
    public MovieResponse create(MovieRequest request) {
        var movie = movieMapper.toMovie(request);
        var genres = genreService.findGenresByIds(request.getGenres());
        movie.setGenres(genres);
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Override
    @Cacheable(value = "movie", key = "#id")
    public MovieResponse getById(String id) {
        var movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        return movieMapper.toMovieResponse(movie);
    }

    @Override
    @Cacheable(value = "movies", key = "'all'")
    public List<MovieResponse> getAll() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    @Override
    public PagedResponse<List<MovieResponse>> getMovies(int pageNo, int pageSize, String sortBy) {
        int page = Math.max(0, pageNo - 1);

        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<Movie> moviePage = movieRepository.findAll(pageable);
        List<MovieResponse> movieResponses = moviePage
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();

        return PagedResponse.<List<MovieResponse>>builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .content(movieResponses)
                .build();
    }

    private Sort buildSort(String sortBy) {
        if (!StringUtils.hasText(sortBy)) return Sort.unsorted();

        Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(sortBy);

        if (matcher.matches()) {
            String field = matcher.group(1);
            String direction = matcher.group(3);
            Sort.Direction sortDirection = Sort.Direction.fromString(direction);
            return Sort.by(new Sort.Order(sortDirection, field));
        }

        return Sort.unsorted();
    }


    @Override
    @Caching(
            evict = @CacheEvict(value = "movies", key = "'all'"),
            put = @CachePut(value = "movie", key = "#id")
    )
    public MovieResponse update(String id, MovieRequest request) {
        var movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
        var genres = genreService.findGenresByIds(request.getGenres());
        movie.setGenres(genres);
        movieMapper.update(movie, request);
        movieRepository.save(movie);
        return movieMapper.toMovieResponse(movie);
    }

    @Override
    public PagedResponse<List<MovieResponse>> searchMovies(Pageable pageable, String[] filters) {
        Page<Movie> moviePage;
        log.info("Search params: {}", Arrays.toString(filters));
        if (filters != null && filters.length > 0) {
            MovieSpecificationBuilder builder = new MovieSpecificationBuilder();

            Pattern pattern = Pattern.compile("(\\w+?)([:<>~!])(\\p{Punct})(.*)(\\p{Punct})");
            for (String filter : filters) {
                Matcher matcher = pattern.matcher(filter);

                if (matcher.find()) {
                    String key = matcher.group(1);
                    String operation = matcher.group(2);
                    String prefix = matcher.group(3);
                    String value = matcher.group(4);
                    String suffix = matcher.group(5);
                    if (value.isEmpty()) {
                        log.warn("Empty value in filter: {}", filter);
                        continue;
                    }
                    builder.with(null, key, operation, value, prefix, suffix);
                } else {
                    log.warn("Invalid filter format: {}", filter);
                }
            }
            Specification<Movie> spec = builder.build();
            moviePage = movieRepository.findAll(spec, pageable);
        } else {
            moviePage = movieRepository.findAll(pageable);
        }

        List<MovieResponse> movieResponses = moviePage.stream()
                .map(movieMapper::toMovieResponse)
                .toList();

        return PagedResponse.<List<MovieResponse>>builder()
                .pageNo(pageable.getPageNumber())
                .pageSize(pageable.getPageSize())
                .totalPages(moviePage.getTotalPages())
                .content(movieResponses)
                .build();
    }
}
