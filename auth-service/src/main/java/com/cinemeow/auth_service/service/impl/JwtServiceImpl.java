package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.service.JwtService;
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
import org.springframework.stereotype.Repository;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Repository
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class JwtServiceImpl implements JwtService {

    @NonFinal
    @Value("${jwt.signerKey}")
    String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.access-token-validity}")
    long ACCESS_TOKEN_VALIDITY; // Ví dụ: 15 phút

    @NonFinal
    @Value("${jwt.refresh-token-validity}")
    long REFRESH_TOKEN_VALIDITY;

    @Override
    public String generateAccessToken(User user) {
        return buildToken(user, ACCESS_TOKEN_VALIDITY, "access");
    }

    @Override
    public String generateRefreshToken(User user) {
        return buildToken(user, REFRESH_TOKEN_VALIDITY, "refresh");
    }

    @Override
    public String buildToken(User user, long validity, String type) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("cinemeow-api")
                .issueTime(new Date())
                .expirationTime(Date.from(Instant.now().plus(validity, ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .claim("type", type)
                .claim("scope", buildScope(user))
                .build();
        Payload payload = new Payload(claims.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot generate token");
            throw new RuntimeException("Cannot generate token", e);
        }
    }

    @Override
    public SignedJWT verifyToken(String token, String expectedType) {
        try {
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            SignedJWT signedJWT = SignedJWT.parse(token);

            if (!signedJWT.verify(verifier)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            Date expiry = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expiry.before(new Date())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }

            String type = signedJWT.getJWTClaimsSet().getStringClaim("type");
            if (!expectedType.equals(type)) {
                throw new AppException(ErrorCode.INVALID_JWT);
            }

            return signedJWT;
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_JWT);
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> {
                joiner.add("ROLE_" + role.getName());
                if (!CollectionUtils.isEmpty(role.getPermissions())) {
                    role.getPermissions().forEach(p -> joiner.add(p.getName()));
                }
            });
        }
        return joiner.toString();
    }
}
