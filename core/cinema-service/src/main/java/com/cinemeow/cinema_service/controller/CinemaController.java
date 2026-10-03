package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.request.CinemaRequest;
import com.cinemeow.cinema_service.dto.response.BaseResponse;
import com.cinemeow.cinema_service.dto.response.CinemaDetailResponse;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.service.CinemaService;
import com.cinemeow.cinema_service.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/cinemas")
@Tag(name = "Cinema Management", description = "APIs for managing cinemas")
public class CinemaController {
    CinemaService cinemaService;
    RoomService roomService;

    @Operation(
            summary = "Create a new cinema",
            description = "Add a new cinema to the system",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Cinema created successfully",
                            content = @Content(schema = @Schema(implementation = CinemaDetailResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid request body")
            }
    )
    @PostMapping
    public BaseResponse<CinemaDetailResponse> create(@Valid @RequestBody CinemaRequest request) {
        return BaseResponse.<CinemaDetailResponse>builder()
                .data(cinemaService.create(request))
                .build();
    }

    @Operation(
            summary = "Get all cinemas",
            description = "Retrieve the list of all cinemas",
            responses = {
                    @ApiResponse(responseCode = "200", description = "List retrieved",
                            content = @Content(schema = @Schema(implementation = CinemaDetailResponse.class)))
            }
    )
    @GetMapping
    public BaseResponse<List<CinemaDetailResponse>> getAll() {
        return BaseResponse.<List<CinemaDetailResponse>>builder()
                .data(cinemaService.getAll())
                .build();
    }

    @Operation(
            summary = "Get cinema detail",
            description = "Retrieve detailed information of a cinema by its ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Cinema detail retrieved",
                            content = @Content(schema = @Schema(implementation = CinemaDetailResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Cinema not found")
            }
    )
    @GetMapping("/detail/{id}")
    public BaseResponse<CinemaDetailResponse> getDetailInfo(
            @Parameter(description = "Cinema ID", required = true)
            @PathVariable String id) {
        return BaseResponse.<CinemaDetailResponse>builder()
                .data(cinemaService.getDetailInfo(id))
                .build();
    }

    @Operation(
            summary = "Update cinema information",
            description = "Update details of an existing cinema by its ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Cinema updated successfully",
                            content = @Content(schema = @Schema(implementation = CinemaDetailResponse.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid request body"),
                    @ApiResponse(responseCode = "404", description = "Cinema not found")
            }
    )
    @PutMapping("/detail/{id}")
    public BaseResponse<CinemaDetailResponse> updateInfo(
            @Parameter(description = "Cinema ID", required = true)
            @PathVariable String id,
            @Valid @RequestBody CinemaRequest request) {
        return BaseResponse.<CinemaDetailResponse>builder()
                .data(cinemaService.updateInfo(id, request))
                .build();
    }

    @Operation(
            summary = "Delete a cinema",
            description = "Remove a cinema from the system by its ID",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Cinema deleted successfully"),
            }
    )
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(
            @Parameter(description = "Cinema ID", required = true)
            @PathVariable String id) {
        cinemaService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }

    @Operation(
            summary = "Get all rooms in a cinema",
            description = "Retrieves a list of all rooms belonging to a specific cinema by its ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Rooms retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RoomResponse.class))),
            }
    )
    @GetMapping("/{cinemaId}/rooms")
    public BaseResponse<List<RoomResponse>> getRooms(@PathVariable String cinemaId) {
        return BaseResponse.<List<RoomResponse>>builder()
                .data(roomService.getRoomsByCinemaId(cinemaId))
                .build();
    }
}
