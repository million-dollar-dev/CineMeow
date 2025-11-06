package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.dto.request.LoginRequest;
import com.cinemeow.auth_service.dto.request.LogoutRequest;
import com.cinemeow.auth_service.dto.request.RefreshRequest;
import com.cinemeow.auth_service.dto.response.AuthenticationResponse;
import com.cinemeow.auth_service.dto.response.IntrospectResponse;
import com.cinemeow.auth_service.entity.ActiveToken;
import com.cinemeow.auth_service.entity.RefreshToken;
import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.repository.ActiveTokenRepository;
import com.cinemeow.auth_service.repository.RefreshTokenRepository;
import com.cinemeow.auth_service.repository.UserRepository;
import com.cinemeow.auth_service.service.AuthenticationService;
import com.cinemeow.auth_service.service.JwtService;
import com.nimbusds.jwt.SignedJWT;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    JwtService jwtService;

    UserRepository userRepository;

    ActiveTokenRepository activeTokenRepository;

    RefreshTokenRepository refreshTokenRepository;

    PasswordEncoder passwordEncoder;

    HttpServletRequest httpServletRequest;

    @NonFinal
    @Value("${jwt.refresh-token-validity}")
    long REFRESH_TOKEN_VALIDITY;

    public AuthenticationResponse authenticate(LoginRequest request) {
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!user.isActive() ||
                !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String deviceInfo = httpServletRequest.getHeader("User-Agent");

        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(Instant.now().plus(REFRESH_TOKEN_VALIDITY, ChronoUnit.SECONDS))
                .revoked(false)
                .deviceInfo(deviceInfo)
                .build();

        refreshTokenRepository.save(entity);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    @Override
    public void logout(LogoutRequest request) {
        refreshTokenRepository.deleteByToken(request.getToken());
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) {
        var token = request.getToken();

        log.info("[refreshToken: {}] token={}", LocalDateTime.now(), token);
        var signedJWT = jwtService.verifyToken(token, "refresh");

        var username = extractUsername(signedJWT);
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        log.info("[refreshToken: {}] username={}", LocalDateTime.now(), username);

        refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHENTICATED));

        log.info("[refreshToken: {}] true={}", LocalDateTime.now(), true);

        String newAccessToken = jwtService.generateAccessToken(user);

        return AuthenticationResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(token)
                .authenticated(true)
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;
        try {
            SignedJWT jwt = jwtService.verifyToken(token, "access");
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }

    @Override
    public AuthenticationResponse verifyAccount(String token) {
        ActiveToken activeToken = activeTokenRepository.findByToken(token)
                .orElseThrow(() -> new AppException(ErrorCode.TOKEN_NOT_FOUND));
        if (activeToken.getUsed()
                || activeToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.ACTIVE_CODE_INVALID);
        }

        User user = activeToken.getUser();
        user.setActive(true);
        userRepository.save(user);

        activeToken.setUsed(true);
        activeTokenRepository.save(activeToken);

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        String deviceInfo = httpServletRequest.getHeader("User-Agent");

        RefreshToken entity = RefreshToken.builder()
                .user(user)
                .token(refreshToken)
                .expiryDate(Instant.now().plus(REFRESH_TOKEN_VALIDITY, ChronoUnit.SECONDS))
                .revoked(false)
                .deviceInfo(deviceInfo)
                .build();

        refreshTokenRepository.save(entity);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    private String extractUsername(SignedJWT signedJWT) {
        try {
            return signedJWT.getJWTClaimsSet().getSubject();
        } catch (ParseException e) {
            throw new AppException(ErrorCode.INVALID_JWT);
        }
    }
}

