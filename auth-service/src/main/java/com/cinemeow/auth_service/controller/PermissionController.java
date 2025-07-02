package com.cinemeow.auth_service.controller;

import com.cinemeow.auth_service.dto.request.PermissionRequest;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.PermissionResponse;
import com.cinemeow.auth_service.service.PermissionService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/permissions")
@Tag(name = "Permissions")
public class PermissionController {
    PermissionService permissionService;

    @PostMapping
    public BaseResponse<PermissionResponse> create(@Valid @RequestBody PermissionRequest request) {
        return BaseResponse.<PermissionResponse>builder()
                .data(permissionService.create(request))
                .build();
    }

    @GetMapping
    public BaseResponse<List<PermissionResponse>> getAll() {
        return BaseResponse.<List<PermissionResponse>>builder()
                .data(permissionService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<PermissionResponse> getById(@PathVariable String id) {
        return BaseResponse.<PermissionResponse>builder()
                .data(permissionService.getById(id))
                .build();
    }

    @PutMapping("/{id}")
    public BaseResponse<PermissionResponse> updateById(
            @PathVariable String id,
            @Valid @RequestBody PermissionRequest request
    ) {
        return BaseResponse.<PermissionResponse>builder()
                .data(permissionService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Void> delete(@PathVariable String id) {
        permissionService.delete(id);
        return BaseResponse.<Void>builder()
                .message("Delete successfully!")
                .build();
    }
}
