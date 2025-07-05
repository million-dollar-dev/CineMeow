package com.cinemeow.movie_service.controller;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.BaseResponse;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.dto.response.PagedResponse;
import com.cinemeow.movie_service.service.MovieService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/movies")
public class MovieController {
    MovieService movieService;

    @PostMapping
    public BaseResponse<MovieResponse> create(@Valid @RequestBody MovieRequest request) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.create(request))
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<MovieResponse> getById(@PathVariable String id) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.getById(id))
                .build();
    }

    @GetMapping
    public BaseResponse<PagedResponse> getMovies(
            @RequestParam(defaultValue = "0", required = false) int pageNo,
            @Min(10) @RequestParam(defaultValue = "20", required = false) int pageSize,
            @RequestParam(required = false) String sortBy
    ) {
        return BaseResponse.<PagedResponse>builder()
                .data(movieService.getMovies(pageNo, pageSize, sortBy))
                .build();
    }

    @PutMapping("/{id}")
    public BaseResponse<MovieResponse> update(@PathVariable String id, @Valid @RequestBody MovieRequest request) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.update(id, request))
                .build();
    }
}
