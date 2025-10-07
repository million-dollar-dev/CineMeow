package com.cinemeow.booking_service.controller;

import com.cinemeow.booking_service.dto.request.TicketPriceRequest;
import com.cinemeow.booking_service.dto.response.BaseResponse;
import com.cinemeow.booking_service.dto.response.TicketPriceResponse;
import com.cinemeow.booking_service.entity.TicketPrice;
import com.cinemeow.booking_service.service.TicketPriceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@RequestMapping("/pricing")
@Tag(name = "Ticket Price", description = "Manage movie ticket prices — create, update, delete, and view details.")
public class TicketPriceController {
    TicketPriceService ticketPriceService;

    @Operation(
            summary = "Create a new ticket price",
            description = "Creates a new ticket price record in the system."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully created",
                    content = @Content(schema = @Schema(implementation = TicketPriceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data", content = @Content),
    })
    @PostMapping
    public BaseResponse<TicketPriceResponse> create(@Valid @RequestBody TicketPriceRequest request) {
        return BaseResponse.<TicketPriceResponse>builder()
                .data(ticketPriceService.create(request))
                .build();
    }

    @Operation(
            summary = "Get all ticket prices",
            description = "Retrieves a list of all available ticket prices in the system."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list",
                    content = @Content(schema = @Schema(implementation = TicketPriceResponse.class))),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content)
    })
    @GetMapping
    public BaseResponse<List<TicketPriceResponse>> getAll() {
        return BaseResponse.<List<TicketPriceResponse>>builder()
                .data(ticketPriceService.getAll())
                .build();
    }

    @Operation(
            summary = "Get ticket price by ID",
            description = "Retrieves detailed information of a specific ticket price using its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved details",
                    content = @Content(schema = @Schema(implementation = TicketPriceResponse.class))),
            @ApiResponse(responseCode = "404", description = "Ticket price not found", content = @Content),
    })
    @GetMapping("/{id}")
    public BaseResponse<TicketPriceResponse> getById(@PathVariable String id) {
        return BaseResponse.<TicketPriceResponse>builder()
                .data(ticketPriceService.getById(id))
                .build();
    }

    @Operation(
            summary = "Update ticket price",
            description = "Updates an existing ticket price record by ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully updated",
                    content = @Content(schema = @Schema(implementation = TicketPriceResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request data", content = @Content),
            @ApiResponse(responseCode = "404", description = "Ticket price not found", content = @Content),
    })
    @PutMapping("/{id}")
    public BaseResponse<TicketPriceResponse> update(@PathVariable String id,
                                                    @Valid @RequestBody TicketPriceRequest request) {
        return BaseResponse.<TicketPriceResponse>builder()
                .data(ticketPriceService.update(id, request))
                .build();
    }

    @Operation(
            summary = "Delete ticket price",
            description = "Deletes a ticket price record from the system by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully deleted"),
    })
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }
}
