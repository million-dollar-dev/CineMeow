package com.cinemeow.auth_service.mapper;

import com.cinemeow.auth_service.dto.request.RoleRequest;
import com.cinemeow.auth_service.dto.request.RoleUpdateRequest;
import com.cinemeow.auth_service.dto.response.RoleResponse;
import com.cinemeow.auth_service.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    //    @Mapping(target = "permissions", ignore = true)
    RoleResponse toRoleResponse(Role role);
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    @Mapping(target = "permissions", ignore = true)
    void update(@MappingTarget Role role, RoleUpdateRequest request);
}
