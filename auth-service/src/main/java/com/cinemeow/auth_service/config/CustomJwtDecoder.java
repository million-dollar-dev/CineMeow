package com.cinemeow.auth_service.config;

import com.cinemeow.auth_service.dto.request.IntrospectRequest;
import com.cinemeow.auth_service.service.impl.AuthenticationServiceImpl;
import com.nimbusds.jose.JOSEException;
import jakarta.annotation.PostConstruct;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.text.ParseException;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomJwtDecoder implements JwtDecoder {

    @Value("${jwt.signerKey}")
    String signerKey;

    NimbusJwtDecoder nimbusJwtDecoder;

    @PostConstruct
    public void init() {
        SecretKeySpec secretKey = new SecretKeySpec(signerKey.getBytes(), "HmacSHA512");
        this.nimbusJwtDecoder = NimbusJwtDecoder
                .withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

    @Override
    public Jwt decode(String token) throws JwtException {
//        return nimbusJwtDecoder.decode(token);
        try {
            Jwt jwt = nimbusJwtDecoder.decode(token);
            System.out.println("Decoded JWT successfully: " + jwt.getClaims());
            return jwt;
        } catch (Exception e) {
            System.err.println("JWT decode failed: " + e.getMessage());
            throw e;
        }
    }
}
