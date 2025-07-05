package com.cinemeow.auth_service.controller;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.dto.request.LoginRequest;
import com.cinemeow.auth_service.dto.request.LogoutRequest;
import com.cinemeow.auth_service.dto.request.RefreshRequest;
import com.cinemeow.auth_service.dto.response.AuthenticationResponse;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.IntrospectResponse;
import com.cinemeow.auth_service.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Tag(name = "Authentication", description = "Endpoints for user authentication, token validation, and session control")
public class AuthenticationController {
    AuthenticationService authenticationService;

    @Operation(
            summary = "Login with username and password",
            description = "Authenticate user and return access & refresh tokens."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    @PostMapping("/login")
    public BaseResponse<AuthenticationResponse> authenticate(@RequestBody LoginRequest request) {
        return BaseResponse.<AuthenticationResponse>builder()
                .data(authenticationService.authenticate(request))
                .build();
    }

    @Operation(
            summary = "Token introspection",
            description = "Validate a given token and return its status."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token introspection result")
    })
    @PostMapping("/introspect")
    public BaseResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        return BaseResponse.<IntrospectResponse>builder()
                .data(authenticationService.introspect(request))
                .build();
    }

    @Operation(summary = "Logout", description = "Invalidate a refresh token to terminate session.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged out")
    })
    @PostMapping("/logout")
    public BaseResponse<Void> logout(@RequestBody LogoutRequest request) {
        authenticationService.logout(request);
        return BaseResponse.<Void>builder()
                .message("Successfully logged out")
                .build();
    }

    @Operation(summary = "Refresh token", description = "Get a new access token using a valid refresh token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token refreshed successfully"),
            @ApiResponse(responseCode = "401", description = "Invalid or expired refresh token")
    })
    @PostMapping("/refresh")
    public BaseResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) {
        return BaseResponse.<AuthenticationResponse>builder()
                .data(authenticationService.refreshToken(request))
                .build();
    }

}
