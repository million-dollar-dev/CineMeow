package com.cinemeow.profile_service.service.impl;

import com.cinemeow.profile_service.dto.request.UserProfileRequest;
import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.PagedResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.entity.UserProfile;
import com.cinemeow.profile_service.exception.AppException;
import com.cinemeow.profile_service.exception.ErrorCode;
import com.cinemeow.profile_service.mapper.UserProfileMapper;
import com.cinemeow.profile_service.repository.UserProfileRepository;
import com.cinemeow.profile_service.service.UserProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserProfileServiceImpl implements UserProfileService {
    UserProfileRepository userProfileRepository;
    UserProfileMapper userProfileMapper;

    @Override
    public UserProfileResponse create(UserProfileRequest request) {
        var profile = userProfileMapper.toUserProfile(request);
        userProfileRepository.save(profile);
        return userProfileMapper.toUserProfileResponse(profile);
    }

    @Override
    public PagedResponse<List<UserProfileResponse>> getProfiles(int pageNo, int pageSize, String sortBy) {
        int page = Math.max(0, pageNo - 1);
        Sort sort = buildSort(sortBy);
        Pageable pageable = PageRequest.of(page, pageSize, sort);

        Page<UserProfile> profilePage = userProfileRepository.findAll(pageable);
        List<UserProfileResponse> profileResponses = profilePage
                .stream()
                .map(userProfileMapper::toUserProfileResponse)
                .toList();

        return PagedResponse.<List<UserProfileResponse>>builder()
                .pageNo(pageNo)
                .pageSize(pageSize)
                .totalElements(profilePage.getTotalElements())
                .totalPages(profilePage.getTotalPages())
                .content(profileResponses)
                .build();
    }

    @Override
    public UserProfileResponse getByUserId(String userId) {
        var profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        return userProfileMapper.toUserProfileResponse(profile);
    }

    @Override
    public UserProfileResponse updateByUserId(String userId, UserProfileUpdateRequest request) {
        var profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        userProfileMapper.update(profile, request);
        userProfileRepository.save(profile);
        return userProfileMapper.toUserProfileResponse(profile);
    }

    @Override
    public void deleteByUserId(String userId) {
        userProfileRepository.deleteByUserId(userId);
    }

    @Override
    public UserProfileResponse getByEmail(String email) {
        var profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.PROFILE_NOT_FOUND));
        return userProfileMapper.toUserProfileResponse(profile);
    }

    private Sort buildSort(String sortBy) {
        if (!StringUtils.hasText(sortBy)) return Sort.unsorted();

        Pattern pattern = Pattern.compile("(\\w+?)(:)(asc|desc)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(sortBy);

        if (matcher.matches()) {
            String field = matcher.group(1);
            String direction = matcher.group(3);
            Sort.Direction sortDirection = Sort.Direction.fromString(direction);
            return Sort.by(new Sort.Order(sortDirection, field));
        }

        return Sort.unsorted();
    }
}
