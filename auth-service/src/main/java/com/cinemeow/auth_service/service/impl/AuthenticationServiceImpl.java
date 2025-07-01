package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.dto.request.LoginRequest;
import com.cinemeow.auth_service.dto.request.LogoutRequest;
import com.cinemeow.auth_service.dto.request.RefreshRequest;
import com.cinemeow.auth_service.dto.response.AuthenticationResponse;
import com.cinemeow.auth_service.dto.response.IntrospectResponse;
import com.cinemeow.auth_service.entity.InvalidatedToken;
import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.repository.InvalidatedTokenRepository;
import com.cinemeow.auth_service.repository.UserRepository;
import com.cinemeow.auth_service.service.AuthenticationService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    InvalidatedTokenRepository invalidatedTokenRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(LoginRequest request) {
        var user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        var token = generateToken(user);
        return AuthenticationResponse.builder().token(token).authenticated(true).build();
    }

    public void logout(LogoutRequest request) {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jti = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();
            var invalidatedToken = InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiryTime)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
        } catch (ParseException e) {
            log.error("Token xử lý lỗi: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_JWT);
        }
    }

    public AuthenticationResponse refreshToken(RefreshRequest request) {
        try {
            var signJWT = verifyToken(request.getToken(), true);

            var jti = signJWT.getJWTClaimsSet().getJWTID();
            var expiryTime = signJWT.getJWTClaimsSet().getExpirationTime();
            var invalidatedToken = InvalidatedToken.builder()
                    .id(jti)
                    .expiryTime(expiryTime)
                    .build();
            invalidatedTokenRepository.save(invalidatedToken);

            var username = signJWT.getJWTClaimsSet().getSubject();
            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

            var token = generateToken(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .authenticated(true)
                    .build();

        } catch (ParseException e) {
            log.error("Refresh token error: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_JWT);
        }
    }


    private SignedJWT verifyToken(String token, boolean isRefresh) {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            Date expirationTime = isRefresh
                    ? Date.from(signedJWT.getJWTClaimsSet()
                    .getIssueTime()
                    .toInstant()
                    .plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS))
                    : signedJWT.getJWTClaimsSet().getExpirationTime();

            boolean isValidSignature = signedJWT.verify(verifier);
            boolean isNotExpired = expirationTime.after(new Date());

            if (!isValidSignature || !isNotExpired) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            return signedJWT;

        } catch (JOSEException | ParseException e) {
            throw new AppException(ErrorCode.INVALID_JWT);
        }
    }


    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now()
                        .plus(VALID_DURATION, ChronoUnit.SECONDS)
                        .toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("Scope", buildScope(user))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot generate token");
            throw new RuntimeException(e);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;
        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }
        return IntrospectResponse.builder()
                .valid(isValid)
                .build();
    }


    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles()))
            user.getRoles().forEach(role -> {
                joiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(permission -> joiner.add(permission.getName()));
                }
            });
        return joiner.toString();
    }
}

