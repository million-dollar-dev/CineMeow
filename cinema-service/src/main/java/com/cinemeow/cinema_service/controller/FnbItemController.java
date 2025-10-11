package com.cinemeow.cinema_service.controller;

import com.cinemeow.cinema_service.dto.request.FnbCalculateRequest;
import com.cinemeow.cinema_service.dto.request.FnbItemRequest;
import com.cinemeow.cinema_service.dto.response.BaseResponse;
import com.cinemeow.cinema_service.dto.response.FnbCalculateResponse;
import com.cinemeow.cinema_service.dto.response.FnbItemResponse;
import com.cinemeow.cinema_service.service.FnbItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RequestMapping("/fnbs")
@Tag(name = "F&B Item Management", description = "APIs for managing food and beverage items in the cinema system.")
public class FnbItemController {
    FnbItemService  fnbItemService;

    @Operation(
            summary = "Create a new F&B item",
            description = "Creates a new food or beverage item with the provided details."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "F&B item created successfully",
                    content = @Content(schema = @Schema(implementation = FnbItemResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class)))
    })
    @PostMapping
    public BaseResponse<FnbItemResponse> create(
            @Valid @RequestBody FnbItemRequest request) {
        return BaseResponse.<FnbItemResponse>builder()
                .data(fnbItemService.creat(request))
                .build();
    }

    @Operation(
            summary = "Get all F&B items",
            description = "Retrieves a list of all food and beverage items available in the system."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list of F&B items",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = FnbItemResponse.class)))),
    })
    @GetMapping()
    public BaseResponse<List<FnbItemResponse>> getAll() {
        return BaseResponse.<List<FnbItemResponse>>builder()
                .data(fnbItemService.getAll())
                .build();
    }

    @Operation(
            summary = "Get F&B item by ID",
            description = "Retrieves details of a specific food or beverage item by its unique ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "F&B item found",
                    content = @Content(schema = @Schema(implementation = FnbItemResponse.class))),
            @ApiResponse(responseCode = "404", description = "F&B item not found")
    })
    @GetMapping("/{id}")
    public BaseResponse<FnbItemResponse> getById(@PathVariable String id) {
        return BaseResponse.<FnbItemResponse>builder()
                .data(fnbItemService.getById(id))
                .build();
    }

    @Operation(
            summary = "Update F&B item",
            description = "Updates an existing food or beverage item using its ID and new details."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "F&B item updated successfully",
                    content = @Content(schema = @Schema(implementation = FnbItemResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "F&B item not found")
    })
    @PutMapping("/{id}")
    public BaseResponse<FnbItemResponse> update(
            @PathVariable String id,
            @Valid @RequestBody FnbItemRequest request) {
        return BaseResponse.<FnbItemResponse>builder()
                .data(fnbItemService.updateById(id, request))
                .build();
    }

    @Operation(
            summary = "Delete F&B item",
            description = "Deletes an existing food or beverage item by its ID."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "F&B item deleted successfully",
                    content = @Content(schema = @Schema(implementation = BaseResponse.class))),
            @ApiResponse(responseCode = "404", description = "F&B item not found")
    })
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }

    @PostMapping("/calculate")
    public FnbCalculateResponse calculate(@Valid @RequestBody FnbCalculateRequest request) {
        return fnbItemService.calculate(request);
    }
}
