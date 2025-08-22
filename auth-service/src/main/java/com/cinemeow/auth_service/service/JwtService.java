package com.cinemeow.auth_service.service;

import com.cinemeow.auth_service.entity.User;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Repository;

@Repository
public interface JwtService {
    String generateAccessToken(User user);
    String generateRefreshToken(User user);
    String buildToken(User user, long validity, String type);
    SignedJWT verifyToken(String token, String expectedType);
}
