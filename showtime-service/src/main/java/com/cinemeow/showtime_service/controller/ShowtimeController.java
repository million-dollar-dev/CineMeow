package com.cinemeow.showtime_service.controller;

import com.cinemeow.showtime_service.dto.request.ShowtimeRequest;
import com.cinemeow.showtime_service.dto.response.BaseResponse;
import com.cinemeow.showtime_service.dto.response.ShowtimeResponse;
import com.cinemeow.showtime_service.service.ShowtimeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/showtimes")
@Slf4j
@Tag(name = "Showtime API", description = "Manage movie showtimes")
public class ShowtimeController {
    ShowtimeService showtimeService;

    @Operation(
            summary = "Create a new showtime",
            description = "Add a new movie showtime to the system")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Showtime created successfully",
                    content = @Content(schema = @Schema(implementation = ShowtimeResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Room or movie not found")
    })
    @PostMapping
    public BaseResponse<ShowtimeResponse> create(@Valid @RequestBody ShowtimeRequest request) {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.create(request))
                .build();
    }

    @Operation(
            summary = "Get all showtimes",
            description = "Retrieve a list of all showtimes in the system")
    @GetMapping
    public BaseResponse<List<ShowtimeResponse>> getAll() {
        return BaseResponse.<List<ShowtimeResponse>>builder()
                .data(showtimeService.getAll())
                .build();
    }

    @Operation(
            summary = "Get showtime by ID",
            description = "Retrieve detailed information about a specific showtime")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Showtime found",
                    content = @Content(schema = @Schema(implementation = ShowtimeResponse.class))),
            @ApiResponse(responseCode = "404", description = "Showtime not found")
    })
    @GetMapping("/{id}")
    public BaseResponse<ShowtimeResponse> getById(
            @Parameter(description = "ID of the showtime") @PathVariable String id) {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.getById(id))
                .build();
    }

    @Operation(
            summary = "Update a showtime",
            description = "Update information of a showtime by ID")
    @PutMapping("/{id}")
    public BaseResponse<ShowtimeResponse> updateById(
            @Parameter(description = "ID of the showtime to update") @PathVariable String id,
            @Valid @RequestBody ShowtimeRequest request
    ) {
        return BaseResponse.<ShowtimeResponse>builder()
                .data(showtimeService.updateById(id, request))
                .build();
    }

    @Operation(
            summary = "Delete a showtime",
            description = "Delete a showtime by ID")
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(
            @Parameter(description = "ID of the showtime to delete") @PathVariable String id) {
        showtimeService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }

    @Operation(
            summary = "Search showtimes with filters and pagination",
            description = """
        Allows searching showtimes using flexible filter templates with multiple conditions.

        ### Filter Template Format
        Each filter should be in the format:  
        ```
        field[operator]"value"
        ```
        - `field`: Showtime field name (e.g. `movieId`, `roomId`, `date`, `status`)  
        - `operator`: One of the following:
            - `:`  → equals (e.g. `status:"ACTIVE"`)
            - `!`  → not equals (e.g. `status!"CANCELLED"`)
            - `<`  → less than (e.g. `date<"2025-09-20"`)
            - `>`  → greater than (e.g. `date>"2025-09-10"`)
            - `~`  → like/contains (e.g. `movieTitle~"Avatar"`)
        - `value`: The actual value in double quotes

        ### Example Filters
        - `movieTitle~"Avatar"` → showtimes of movies with "Avatar" in the title
        - `roomId:"abc123"` → showtimes in a specific room
        - `date>"2025-09-10"` → showtimes after Sept 10, 2025
        - `status:"ACTIVE"` → only active showtimes

        Multiple filters can be combined:
        ```
        /showtimes/search?filters=movieTitle~"Avatar"&filters=date>"2025-09-10"
        ```""",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Successful search"),
                    @ApiResponse(responseCode = "400", description = "Invalid filter format")
            }
    )
    @GetMapping("/search")
    public BaseResponse<List<ShowtimeResponse>> searchShowtime(
            @Parameter(description = "List of filters, e.g. movieId=123, cinemaId=456")
            Pageable pageable,
            @RequestParam(required = false) String[] filters
    ) {
        return BaseResponse.<List<ShowtimeResponse>>builder()
                .data(showtimeService.searchShowtime(pageable, filters))
                .build();
    }
}
