package com.cinemeow.auth_service.controller;

import com.cinemeow.auth_service.dto.request.RoleRequest;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.RoleResponse;
import com.cinemeow.auth_service.service.RoleService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/roles")
public class RoleController {
    RoleService roleService;

    @PostMapping
    public BaseResponse<RoleResponse> create(@Valid @RequestBody RoleRequest request) {
        return BaseResponse.<RoleResponse>builder()
                .data(roleService.create(request))
                .build();
    }


    @GetMapping
    public BaseResponse<List<RoleResponse>> getAll() {
        return BaseResponse.<List<RoleResponse>>builder()
                .data(roleService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<RoleResponse> getById(@PathVariable String id) {
        return BaseResponse.<RoleResponse>builder()
                .data(roleService.getById(id))
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<String> delete(@PathVariable String id) {
        roleService.delete(id);
        return BaseResponse.<String>builder()
                .data(new String("Delete successfully!"))
                .build();
    }
}
