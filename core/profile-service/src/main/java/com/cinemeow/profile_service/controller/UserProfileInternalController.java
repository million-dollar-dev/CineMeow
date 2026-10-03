package com.cinemeow.profile_service.controller;

import com.cinemeow.profile_service.dto.request.UserProfileRequest;
import com.cinemeow.profile_service.dto.response.BaseResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.service.UserProfileService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/internal/users")
@Tag(name = "User Profile - Internal", description = "Internal API for managing user profiles")
public class UserProfileInternalController {

    UserProfileService userProfileService;

    @Operation(
            summary = "Create new user profile",
            description = "Creates a new user profile using the provided user profile data."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User profile created successfully",
                    content = @Content(mediaType = "application/json", schema = @Schema(implementation = UserProfileResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid request body",
                    content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error",
                    content = @Content)
    })
    @PostMapping()
    public BaseResponse<UserProfileResponse> create(
            @Valid
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "User profile creation request",
                    required = true,
                    content = @Content(schema = @Schema(implementation = UserProfileRequest.class))
            )
            @RequestBody UserProfileRequest request
    ) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.create(request))
                .build();
    }
}
