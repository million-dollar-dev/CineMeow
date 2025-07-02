package com.cinemeow.auth_service.controller;

import com.cinemeow.auth_service.dto.request.RegisterRequest;
import com.cinemeow.auth_service.dto.request.UserUpdateRoleRequest;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.UserResponse;
import com.cinemeow.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
@Slf4j
public class UserController {
    UserService userService;

    @PostMapping("/registration")
    public BaseResponse<UserResponse> create(@Valid @RequestBody RegisterRequest request) {
        return BaseResponse.<UserResponse>builder()
                .data(userService.create(request))
                .build();
    }

    @GetMapping
    public BaseResponse<List<UserResponse>> getAll() {
        return BaseResponse.<List<UserResponse>>builder()
                .data(userService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    public BaseResponse<UserResponse> getById(@PathVariable String id) {
        return BaseResponse.<UserResponse>builder()
                .data(userService.getById(id))
                .build();
    }


    @PutMapping("/updateRole/{id}")
    public BaseResponse<UserResponse> updateRoleById(@PathVariable String id,
                                                     @Valid @RequestBody UserUpdateRoleRequest request) {
        return BaseResponse.<UserResponse>builder()
                .data(userService.update(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public BaseResponse<Void> deleteById(@PathVariable String id) {
        return BaseResponse.<Void>builder()
                .message("Delete Successfully!")
                .build();
    }
}