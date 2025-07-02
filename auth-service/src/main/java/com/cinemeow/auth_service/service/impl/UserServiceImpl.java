package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.dto.request.RegisterRequest;
import com.cinemeow.auth_service.dto.request.UserUpdateRoleRequest;
import com.cinemeow.auth_service.dto.response.UserResponse;
import com.cinemeow.auth_service.entity.Role;
import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.mapper.UserMapper;
import com.cinemeow.auth_service.repository.RoleRepository;
import com.cinemeow.auth_service.repository.UserRepository;
import com.cinemeow.auth_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;

    public UserResponse create(RegisterRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(request.getPassword());

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById("USER").ifPresent(roles::add);
        user.setRoles(roles);
        try {
            userRepository.save(user);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        return userMapper.toUserResponse(user);
    }


    public List<UserResponse> getAll() {
        List<UserResponse> list = new ArrayList<>();
        userRepository.findAll().forEach(user -> list.add(userMapper.toUserResponse(user)));
        return list;
    }


    public UserResponse getById(String id) {
        return userMapper.toUserResponse(
                userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found")));
    }

    @Override
    public UserResponse update(String id, UserUpdateRoleRequest request) {
        return null;
    }

    public void delete(String userId) {
        userRepository.deleteById(userId);
    }
}
