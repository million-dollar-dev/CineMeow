package com.cinemeow.auth_service.service;

import com.cinemeow.auth_service.dto.request.RegisterRequest;
import com.cinemeow.auth_service.dto.request.UserUpdateRoleRequest;
import com.cinemeow.auth_service.dto.response.UserResponse;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

public interface UserService {
    UserResponse create(RegisterRequest request);
    List<UserResponse> getAll();
    UserResponse getById(String id);
    UserResponse update(String id, UserUpdateRoleRequest request);
    void delete(String id);
    UserResponse getMyInfo(Jwt jwt);
}
