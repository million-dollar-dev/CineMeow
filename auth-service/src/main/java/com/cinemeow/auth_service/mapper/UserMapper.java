package com.cinemeow.auth_service.mapper;

import com.cinemeow.auth_service.dto.request.RegisterRequest;
import com.cinemeow.auth_service.dto.request.UserUpdateRoleRequest;
import com.cinemeow.auth_service.dto.response.UserResponse;
import com.cinemeow.auth_service.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(RegisterRequest request);
    UserResponse toUserResponse(User user);
    @Mapping(target = "roles", ignore = true)
    void updateUser(@MappingTarget User user, UserUpdateRoleRequest request);
}
