package com.cinemeow.auth_service.client;

import com.cinemeow.auth_service.dto.request.SendMailRequest;
import com.cinemeow.auth_service.dto.request.UserProfileRequest;
import com.cinemeow.auth_service.dto.response.BaseResponse;
import com.cinemeow.auth_service.dto.response.EmailResponse;
import com.cinemeow.auth_service.dto.response.UserProfileResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "profile-service",
        url = "${app.services.profile-service}"
)
public interface ProfileClient {
    @PostMapping("/internal/users")
    BaseResponse<UserProfileResponse> create(@RequestBody UserProfileRequest request);
}
