package com.cinemeow.profile_service.controller;

import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.BaseResponse;
import com.cinemeow.profile_service.dto.response.PagedResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
@Tag(name = "User Profiles", description = "APIs for managing user profiles")
public class UserProfileController {

    UserProfileService userProfileService;

    @Operation(summary = "Get user profile by user ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{userId}")
    public BaseResponse<UserProfileResponse> getByUserId(
            @Parameter(description = "User ID", example = "12345")
            @PathVariable String userId) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.getByUserId(userId))
                .build();
    }

    @Operation(summary = "Get paginated list of user profiles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved paginated user profiles")
    })
    @GetMapping
    public BaseResponse<PagedResponse> getProfiles(
            @Parameter(description = "Page number (starting from 0)", example = "0")
            @RequestParam(defaultValue = "0", required = false) int pageNo,

            @Parameter(description = "Number of records per page (minimum 10)", example = "20")
            @Min(10) @RequestParam(defaultValue = "20", required = false) int pageSize,

            @Parameter(description = "Field to sort by (e.g., name, createdAt)", example = "name")
            @RequestParam(required = false) String sortBy
    ) {
        return BaseResponse.<PagedResponse>builder()
                .data(userProfileService.getProfiles(pageNo, pageSize, sortBy))
                .build();
    }

    @Operation(summary = "Update user profile by user ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated user profile"),
            @ApiResponse(responseCode = "400", description = "Invalid input")
    })
    @PutMapping("/{userId}")
    public BaseResponse<UserProfileResponse> updateByUserId(
            @Parameter(description = "User ID", example = "12345")
            @PathVariable String userId,

            @Parameter(description = "User profile update request body")
            @Valid @RequestBody UserProfileUpdateRequest request
    ) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.updateByUserId(userId, request))
                .build();
    }

    @Operation(summary = "Delete user profile by user ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deleted user profile"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @DeleteMapping("/{userId}")
    public BaseResponse<String> deleteByUserId(
            @Parameter(description = "User ID", example = "12345")
            @PathVariable String userId) {
        userProfileService.deleteByUserId(userId);
        return BaseResponse.<String>builder()
                .data("Delete successfully!")
                .build();
    }

    @Operation(summary = "Get user profile by email address")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user profile by email"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/findEmail/{email}")
    public BaseResponse<UserProfileResponse> getByEmail(
            @Parameter(description = "User's email address", example = "example@gmail.com")
            @PathVariable String email) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.getByEmail(email))
                .build();
    }
}

