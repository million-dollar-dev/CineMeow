package com.cinemeow.movie_service.controller;

import com.cinemeow.movie_service.dto.request.MovieRequest;
import com.cinemeow.movie_service.dto.response.BaseResponse;
import com.cinemeow.movie_service.dto.response.MovieResponse;
import com.cinemeow.movie_service.dto.response.PagedResponse;
import com.cinemeow.movie_service.service.MovieService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/movies")
public class MovieController {
    private static final Logger log = LoggerFactory.getLogger(MovieController.class);
    MovieService movieService;

    @Operation(
            summary = "Create a new movie",
            description = "Creates a new movie record with validated fields",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Movie successfully created",
                            content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input")
            }
    )
    @PostMapping
    public BaseResponse<MovieResponse> create(@Valid @RequestBody MovieRequest request) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.create(request))
                .build();
    }

    @Operation(
            summary = "Get movie by ID",
            description = "Fetches detailed movie information by ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Movie found",
                            content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Movie not found")
            }
    )
    @GetMapping("/{id}")
    public BaseResponse<MovieResponse> getById(
            @Parameter(description = "Movie ID", required = true)
            @PathVariable String id
    ) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.getById(id))
                .build();
    }

    @Operation(
            summary = "Get paginated list of movies",
            description = "Returns a paginated and optionally sorted list of movies"
    )
    @GetMapping
    public BaseResponse<PagedResponse> getMovies(
            @Parameter(description = "Page number (starting from 0)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int pageNo,

            @Parameter(description = "Page size", example = "20")
            @Min(10) @RequestParam(defaultValue = "20", required = false) int pageSize,

            @Parameter(description = "Sort field and direction, e.g., title:asc or title:desc")
            @RequestParam(required = false) String sortBy
    ) {
        return BaseResponse.<PagedResponse>builder()
                .data(movieService.getMovies(pageNo, pageSize, sortBy))
                .build();
    }

    @Operation(
            summary = "Get list of all movies",
            description = "Returns list of all movies"
    )
    @GetMapping("/all")
    public BaseResponse<List<MovieResponse>> getAll() {
        return BaseResponse.<List<MovieResponse>>builder()
                .data(movieService.getAll())
                .build();
    }

    @Operation(
            summary = "Update an existing movie",
            description = "Updates movie data based on ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Movie successfully updated",
                            content = @Content(schema = @Schema(implementation = MovieResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Movie not found")
            }
    )
    @PutMapping("/{id}")
    public BaseResponse<MovieResponse> update(
            @Parameter(description = "ID of the movie to update", required = true)
            @PathVariable String id,

            @Valid @RequestBody MovieRequest request
    ) {
        return BaseResponse.<MovieResponse>builder()
                .data(movieService.update(id, request))
                .build();
    }

    @Operation(
            summary = "Search movies with filters and pagination",
            description = """
            Allows searching movies using flexible filter templates with multiple conditions.

            ### Filter Template Format
            Each filter should be in the format:  
            ```
            field[operator]"value"
            ```
            - `field`: Movie field name (e.g. `title`, `status`, `rating`, etc.)  
            - `operator`: One of the following:
                - `:`  → equals (e.g. `status:"RELEASED"`)
                - `!`  → not equals (e.g. `status!"UPCOMING"`)
                - `<`  → less than (e.g. `rating<7`)
                - `>`  → greater than (e.g. `rating>8`)
                - `~`  → like/contains (e.g. `title~"ritual"`)
            - `value`: The actual value in double quotes

            ### Example Filters
            - `title~"ritual"`: search movies with "ritual" in the title
            - `status:"RELEASED"`: movies that are released
            - `rating>8`: movies with rating greater than 8
            - `duration<120`: movies shorter than 2 hours

            Multiple filters can be combined:
            ```
            /movies/search?filters=title~"ritual"&filters=rating>7
            ```""",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successful search"),
                    @ApiResponse(responseCode = "400", description = "Invalid filter format")
            }
    )
    @GetMapping("/search")
    public BaseResponse<PagedResponse> searchMovies(
            Pageable pageable,
            @RequestParam(required = false) String[] filters
    ) {
        return BaseResponse.<PagedResponse>builder()
                .data(movieService.searchMovies(pageable, filters))
                .build();
    }
}
