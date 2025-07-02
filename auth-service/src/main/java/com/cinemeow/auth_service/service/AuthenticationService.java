package com.cinemeow.auth_service.service;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.dto.request.LoginRequest;
import com.cinemeow.auth_service.dto.request.LogoutRequest;
import com.cinemeow.auth_service.dto.request.RefreshRequest;
import com.cinemeow.auth_service.dto.response.AuthenticationResponse;
import com.cinemeow.auth_service.dto.response.IntrospectResponse;
import org.springframework.stereotype.Service;

@Service
public interface AuthenticationService {
    AuthenticationResponse authenticate(LoginRequest request);
    void logout(LogoutRequest request);
    AuthenticationResponse refreshToken(RefreshRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
}
