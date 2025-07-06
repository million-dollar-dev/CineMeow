package com.cinemeow.movie_service.controller;

import com.cinemeow.movie_service.dto.request.GenreRequest;
import com.cinemeow.movie_service.dto.response.BaseResponse;
import com.cinemeow.movie_service.dto.response.GenreResponse;
import com.cinemeow.movie_service.service.GenreService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/genres")
public class GenreController {
    GenreService genreService;

    @Operation(
            summary = "Create a new genre",
            description = "Creates a new movie genre and returns the created genre",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre successfully created",
                            content = @Content(schema = @Schema(implementation = GenreResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input data")
            }
    )
    @PostMapping
    public BaseResponse<GenreResponse> create(@Valid @RequestBody GenreRequest request) {
        return BaseResponse.<GenreResponse>builder()
                .data(genreService.create(request))
                .build();
    }

    @Operation(
            summary = "Get all genres",
            description = "Returns a list of all available movie genres",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genres fetched successfully",
                            content = @Content(schema = @Schema(implementation = GenreResponse.class)))
            }
    )
    @GetMapping
    public BaseResponse<List<GenreResponse>> getAll() {
        return BaseResponse.<List<GenreResponse>>builder()
                .data(genreService.getAll())
                .build();
    }

    @Operation(
            summary = "Delete genre by ID",
            description = "Deletes a genre based on its ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Genre successfully deleted"),
                    @ApiResponse(responseCode = "404", description = "Genre not found")
            }
    )
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(
            @Parameter(description = "ID of the genre to delete", required = true)
            @PathVariable Integer id
    ) {
        genreService.deleteById(id);
        return BaseResponse.<Void>builder()
                .message("Deleted Successfully!")
                .build();
    }
}
