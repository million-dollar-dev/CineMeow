package com.cinemeow.profile_service.controller;

import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.BaseResponse;
import com.cinemeow.profile_service.dto.response.PagedResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.service.UserProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/users")
public class UserProfileController {
    UserProfileService userProfileService;

    @GetMapping("/{userId}")
    public BaseResponse<UserProfileResponse> getByUserId(@PathVariable String userId) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.getByUserId(userId))
                .build();
    }

    @GetMapping
    public BaseResponse<PagedResponse> getProfiles(
            @RequestParam(defaultValue = "0", required = false) int pageNo,
            @Min(10) @RequestParam(defaultValue = "20", required = false) int pageSize,
            @RequestParam(required = false) String sortBy
    ) {
        return BaseResponse.<PagedResponse>builder()
                .data(userProfileService.getProfiles(pageNo, pageSize, sortBy))
                .build();
    }

    @PutMapping("/{userId}")
    public BaseResponse<UserProfileResponse> updateByUserId(
            @PathVariable String userId,
            @Valid @RequestBody UserProfileUpdateRequest request
    ) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.updateByUserId(userId, request))
                .build();
    }

    @DeleteMapping("/{userId}")
    public BaseResponse<String> deleteByUserId(@PathVariable String userId) {
        userProfileService.deleteByUserId(userId);
        return BaseResponse.<String>builder()
                .data(new String("Delete successfully!"))
                .build();
    }

    @GetMapping("/findEmail/{email}")
    public BaseResponse<UserProfileResponse> getByEmail(@PathVariable String email) {
        return BaseResponse.<UserProfileResponse>builder()
                .data(userProfileService.getByEmail(email))
                .build();
    }
}
