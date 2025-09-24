package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.request.RoomRequest;
import com.cinemeow.cinema_service.dto.request.SeatMapRequest;
import com.cinemeow.cinema_service.dto.response.BaseResponse;
import com.cinemeow.cinema_service.dto.response.RoomResponse;
import com.cinemeow.cinema_service.dto.response.SeatMapResponse;
import com.cinemeow.cinema_service.service.RoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/rooms")
@Tag(name = "Room API", description = "Manage cinema rooms")
public class RoomController {
    RoomService roomService;

    @Operation(
            summary = "Create a new room",
            description = "Creates a new cinema room within a cinema.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Room created successfully",
                            content = @Content(schema = @Schema(implementation = RoomResponse.class))),
            }
    )
    @PostMapping
    public BaseResponse<RoomResponse> create(@Valid @RequestBody RoomRequest request) {
        return BaseResponse.<RoomResponse>builder()
                .data(roomService.create(request))
                .build();
    }

    @Operation(
            summary = "Update room information",
            description = "Updates the details of an existing room by its ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Room updated successfully",
                            content = @Content(schema = @Schema(implementation = RoomResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Room not found"),
            }
    )
    @PutMapping("/{id}")
    public BaseResponse<RoomResponse> updateInfo(
            @PathVariable String id,
            @Valid @RequestBody RoomRequest request
    ) {
        return BaseResponse.<RoomResponse>builder()
                .data(roomService.update(id, request))
                .build();
    }

    @Operation(
            summary = "Get room details",
            description = "Retrieves the details of a specific room by its ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Room details retrieved successfully",
                            content = @Content(schema = @Schema(implementation = RoomResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Room not found")
            }
    )
    @GetMapping("/{id}")
    public BaseResponse<RoomResponse> getInfo(@PathVariable String id) {
        return BaseResponse.<RoomResponse>builder()
                .data(roomService.getById(id))
                .build();
    }

    @Operation(
            summary = "Delete a room",
            description = "Deletes a room from the system by its ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Room deleted successfully",
                            content = @Content(schema = @Schema(implementation = BaseResponse.class))),
            }
    )
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        roomService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }

    @Operation(
            summary = "Create seat map for a room",
            description = "Creates a new seat map for a given room.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Seat map created successfully",
                            content = @Content(schema = @Schema(implementation = BaseResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Room not found")
            }
    )
    @PostMapping("/{id}/seats")
    public BaseResponse<SeatMapResponse> createSeatMap(
            @PathVariable String id,
            @Valid @RequestBody SeatMapRequest request
    ) {
        return BaseResponse.<SeatMapResponse>builder()
                .data(roomService.createSeatMap(id, request))
                .build();
    }

    @Operation(
            summary = "Update seat map of a room",
            description = "Updates the seat map for a given room.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Seat map created successfully",
                            content = @Content(schema = @Schema(implementation = BaseResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Room not found")
            }
    )
    @PutMapping("/{id}/seats")
    public BaseResponse<SeatMapResponse> updateSeatMap(
            @PathVariable String id,
            @Valid @RequestBody SeatMapRequest request
    ) {
        return BaseResponse.<SeatMapResponse>builder()
                .data(roomService.updateSeatMap(id, request))
                .build();
    }

    @Operation(
            summary = "Get seat map of a room",
            description = "Retrieves the current seat map for a given room.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Seat map created successfully",
                            content = @Content(schema = @Schema(implementation = BaseResponse.class))),
                    @ApiResponse(responseCode = "404", description = "Room not found")
            }
    )
    @GetMapping("/{id}/seats")
    public BaseResponse<SeatMapResponse> getSeatMap(@PathVariable String id) {
        return BaseResponse.<SeatMapResponse>builder()
                .data(roomService.getSeatMap(id))
                .build();
    }
}
