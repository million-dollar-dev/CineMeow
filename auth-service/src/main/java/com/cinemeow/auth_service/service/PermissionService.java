package com.cinemeow.auth_service.service;

import com.cinemeow.auth_service.dto.request.PermissionRequest;
import com.cinemeow.auth_service.dto.response.PermissionResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface PermissionService {
    PermissionResponse create(PermissionRequest request);
    List<PermissionResponse> getAll();
    PermissionResponse getById(String id);
    PermissionResponse update(String id, PermissionRequest request);
    void delete(String id);
}
