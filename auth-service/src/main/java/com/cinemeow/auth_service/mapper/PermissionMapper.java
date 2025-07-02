package com.cinemeow.auth_service.mapper;

import com.cinemeow.auth_service.dto.request.PermissionRequest;
import com.cinemeow.auth_service.dto.response.PermissionResponse;
import com.cinemeow.auth_service.entity.Permission;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);
    PermissionResponse toPermissionResponse(Permission permission);
    void update(@MappingTarget Permission permission, PermissionRequest request);
}
