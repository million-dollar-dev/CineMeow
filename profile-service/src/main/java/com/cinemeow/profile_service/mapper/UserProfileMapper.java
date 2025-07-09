package com.cinemeow.profile_service.mapper;

import com.cinemeow.profile_service.dto.request.UserProfileRequest;
import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.entity.UserProfile;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {
    UserProfile toUserProfile(UserProfileRequest request);
    UserProfileResponse toUserProfileResponse(UserProfile userProfile);
    void update(@MappingTarget UserProfile profile, UserProfileUpdateRequest request);
}
