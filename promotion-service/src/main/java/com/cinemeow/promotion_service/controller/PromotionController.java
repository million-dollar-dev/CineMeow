package com.cinemeow.promotion_service.controller;

import com.cinemeow.promotion_service.dto.request.PromotionRequest;
import com.cinemeow.promotion_service.dto.response.BaseResponse;
import com.cinemeow.promotion_service.dto.response.PromotionResponse;
import com.cinemeow.promotion_service.service.PromotionService;
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

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/promotions")
@Tag(name = "Promotion Management", description = "APIs for managing promotions in the system")
public class PromotionController {
    PromotionService promotionService;

    @Operation(
            summary = "Create a new promotion",
            description = "Add a new promotion to the system with all necessary details.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Promotion successfully created",
                            content = @Content(schema = @Schema(implementation = PromotionResponse.class))
                    )
            }
    )
    @PostMapping
    public BaseResponse<PromotionResponse> create(@Valid @RequestBody PromotionRequest request) {
        return BaseResponse.<PromotionResponse>builder()
                .data(promotionService.create(request))
                .build();
    }

    @Operation(
            summary = "Get promotion by ID",
            description = "Retrieve promotion details by its unique identifier.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Promotion found",
                            content = @Content(schema = @Schema(implementation = PromotionResponse.class))
                    ),
                    @ApiResponse(responseCode = "404", description = "Promotion not found")
            }
    )
    @GetMapping("/{id}")
    public BaseResponse<PromotionResponse> getById(@PathVariable String id) {
        return BaseResponse.<PromotionResponse>builder()
                .data(promotionService.getById(id))
                .build();
    }

    @Operation(
            summary = "Get all promotions",
            description = "Retrieve a list of all available promotions in the system."
    )
    @GetMapping
    public BaseResponse<List<PromotionResponse>> getAll() {
        return BaseResponse.<List<PromotionResponse>>builder()
                .data(promotionService.getAll())
                .build();
    }

    @Operation(
            summary = "Update promotion",
            description = "Update the details of an existing promotion by ID.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Promotion successfully updated",
                            content = @Content(schema = @Schema(implementation = PromotionResponse.class))
                    ),
                    @ApiResponse(responseCode = "404", description = "Promotion not found")
            }
    )
    @PutMapping("/{id}")
    public BaseResponse<PromotionResponse> update(
            @PathVariable String id,
            @Valid @RequestBody PromotionRequest request
    ) {
        return BaseResponse.<PromotionResponse>builder()
                .data(promotionService.update(id, request))
                .build();
    }

    @Operation(
            summary = "Delete promotion",
            description = "Delete a promotion by its ID.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Promotion successfully deleted"),
                    @ApiResponse(responseCode = "404", description = "Promotion not found")
            }
    )
    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        promotionService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Promotion has been deleted")
                .build();
    }
}
