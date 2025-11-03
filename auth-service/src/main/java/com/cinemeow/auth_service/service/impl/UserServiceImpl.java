package com.cinemeow.auth_service.service.impl;

import com.cinemeow.auth_service.client.NotificationClient;
import com.cinemeow.auth_service.dto.request.RegisterRequest;
import com.cinemeow.auth_service.dto.request.SendMailRequest;
import com.cinemeow.auth_service.dto.request.UserUpdateRoleRequest;
import com.cinemeow.auth_service.dto.response.UserResponse;
import com.cinemeow.auth_service.entity.ActiveToken;
import com.cinemeow.auth_service.entity.Recipient;
import com.cinemeow.auth_service.entity.Role;
import com.cinemeow.auth_service.entity.User;
import com.cinemeow.auth_service.exception.AppException;
import com.cinemeow.auth_service.exception.ErrorCode;
import com.cinemeow.auth_service.mapper.UserMapper;
import com.cinemeow.auth_service.repository.ActiveTokenRepository;
import com.cinemeow.auth_service.repository.RoleRepository;
import com.cinemeow.auth_service.repository.UserRepository;
import com.cinemeow.auth_service.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    NotificationClient notificationClient;
    ActiveTokenRepository activeTokenRepository;

    @NonFinal
    @Value("${app.verify-url}")
    String verifyUrl;

    public UserResponse create(RegisterRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(request.getPassword());

        HashSet<Role> roles = new HashSet<>();
        roleRepository.findById("USER").ifPresent(roles::add);
        user.setRoles(roles);
        user.setActive(false);

        String token = UUID.randomUUID().toString();
        ActiveToken  activeToken = ActiveToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(24))
                .build();


        try {
            userRepository.save(user);
            activeTokenRepository.save(activeToken);
        } catch (DataIntegrityViolationException exception) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }

        sendActiveMail(request.getEmail(), token);
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

    private void sendActiveMail(String email, String token) {
        String url= verifyUrl + "?token=" + token;
        Map<String, Object> data = new HashMap<>();
        data.put("verificationUrl", url);

        SendMailRequest request = SendMailRequest.builder()
                .to(new Recipient("guest", email))
                .subject("Xác nhận tài khoản của bạn - CineMeow")
                .templateName("register-confirmation")
                .build();

        notificationClient.sendMail(request);
    }
}
