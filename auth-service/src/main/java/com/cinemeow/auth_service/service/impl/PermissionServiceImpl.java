package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.dto.request.PermissionRequest;
import com.cinemeow.auth_service.dto.response.PermissionResponse;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.mapper.PermissionMapper;
import com.cinemeow.auth_service.repository.PermissionRepository;
import com.cinemeow.auth_service.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionServiceImpl implements PermissionService {
    PermissionRepository permissionRepository;
    PermissionMapper permissionMapper;

    @Override
    public PermissionResponse create(PermissionRequest request) {
        var permission = permissionMapper.toPermission(request);
        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @Override
    public List<PermissionResponse> getAll() {
        List<PermissionResponse> list = new ArrayList<>();
        permissionRepository.findAll()
                .stream().forEach(p -> list.add(permissionMapper.toPermissionResponse(p)));
        return list;
    }

    @Override
    public PermissionResponse getById(String id) {
        var permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        return permissionMapper.toPermissionResponse(permission);
    }

    @Override
    public PermissionResponse update(String id, PermissionRequest request) {
        var permission = permissionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PERMISSION_NOT_EXISTED));
        permissionMapper.update(permission, request);
        permissionRepository.save(permission);
        return permissionMapper.toPermissionResponse(permission);
    }

    @Override
    public void delete(String id) {
        permissionRepository.deleteById(id);
    }
}
