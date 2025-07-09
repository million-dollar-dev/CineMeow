package com.cinemeow.profile_service.service;

import com.cinemeow.profile_service.dto.request.UserProfileRequest;
import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.PagedResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserProfileService {
    UserProfileResponse create(UserProfileRequest request);
    PagedResponse<List<UserProfileResponse>> getProfiles(int pageNo, int pageSize, String sortBy);
    UserProfileResponse getByUserId(String userId);
    UserProfileResponse updateByUserId(String userId, UserProfileUpdateRequest request);
    void deleteByUserId(String userId);
    UserProfileResponse getByEmail(String email);
}
