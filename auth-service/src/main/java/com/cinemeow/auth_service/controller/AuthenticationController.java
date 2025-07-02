package com.cinemeow.auth_service.controller;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.dto.request.LoginRequest;
import com.cinemeow.auth_service.dto.request.LogoutRequest;
import com.cinemeow.auth_service.dto.request.RefreshRequest;
import com.cinemeow.auth_service.dto.response.AuthenticationResponse;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.IntrospectResponse;
import com.cinemeow.auth_service.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public BaseResponse<AuthenticationResponse> authenticate(@RequestBody LoginRequest request) {
        return BaseResponse.<AuthenticationResponse>builder()
                .data(authenticationService.authenticate(request))
                .build();
    }

    @PostMapping("/introspect")
    public BaseResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        return BaseResponse.<IntrospectResponse>builder()
                .data(authenticationService.introspect(request))
                .build();
    }

    @PostMapping("/logout")
    public BaseResponse<Void> logout(@RequestBody LogoutRequest request) {
        authenticationService.logout(request);
        return BaseResponse.<Void>builder()
                .message("Successfully logged out")
                .build();
    }

    @PostMapping("/refresh")
    public BaseResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request) {
        return BaseResponse.<AuthenticationResponse>builder()
                .data(authenticationService.refreshToken(request))
                .build();
    }

}
