package com.cinemeow.profile_service.service.impl;

import com.cinemeow.common.exception.AppException;
import com.cinemeow.common.exception.ErrorCode;
import com.cinemeow.profile_service.dto.request.UserProfileRequest;
import com.cinemeow.profile_service.dto.request.UserProfileUpdateRequest;
import com.cinemeow.profile_service.dto.response.PagedResponse;
import com.cinemeow.profile_service.dto.response.UserProfileResponse;
import com.cinemeow.profile_service.entity.UserProfile;
import com.cinemeow.profile_service.mapper.UserProfileMapper;
import com.cinemeow.profile_service.repository.UserProfileRepository;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@FieldDefaults(level = AccessLevel.PRIVATE)
class UserProfileServiceImplTest {
    @Mock
    UserProfileRepository userProfileRepository;

    @Mock
    UserProfileMapper userProfileMapper;

    @InjectMocks
    UserProfileServiceImpl userProfileService;

    UserProfile userProfile;

    UserProfileResponse userProfileResponse;

    UserProfileRequest request;

    @BeforeEach
    void setUp() {
        this.userProfile = UserProfile.builder()
                .id("user-1")
                .userId("USER_1")
                .email("example@gmail.com")
                .phoneNumber("012345678")
                .build();

        this.request = UserProfileRequest.builder()
                .userId("USER_1")
                .email("example@gmail.com")
                .phoneNumber("012345678")
                .build();

        this.userProfileResponse = UserProfileResponse.builder()
                .id("user-1")
                .userId("USER_1")
                .email("example@gmail.com")
                .phoneNumber("012345678")
                .build();
    }

    @Test
    void testCreate_Success() {
        when(userProfileMapper.toUserProfile(request)).thenReturn(userProfile);
        when(userProfileRepository.save(userProfile)).thenReturn(userProfile);
        when(userProfileMapper.toUserProfileResponse(userProfile)).thenReturn(userProfileResponse);

        UserProfileResponse result = userProfileService.create(request);

        assertNotNull(result);
        assertEquals(request.getEmail(), result.getEmail());
        assertEquals(request.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(request.getUserId(), result.getUserId());
        verify(userProfileMapper).toUserProfile(request);
        verify(userProfileRepository).save(userProfile);
        verify(userProfileMapper).toUserProfileResponse(userProfile);
    }

    @Test
    void testGetByUserId_WhenUserIdExists_ReturnUserProfile() {
        String userId = "USER_1";
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(userProfile));
        when(userProfileMapper.toUserProfileResponse(userProfile)).thenReturn(userProfileResponse);

        UserProfileResponse result = userProfileService.getByUserId(userId);

        assertNotNull(result);
        assertEquals("user-1", result.getId());
        assertEquals("example@gmail.com", result.getEmail());
        assertEquals("012345678", result.getPhoneNumber());
        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileMapper).toUserProfileResponse(userProfile);
    }

    @Test
    void testGetByUserId_WhenUserIdNotExists_ThrowsAppException() {
        String userId = "UN_KNOWN";
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userProfileService.getByUserId(userId));

        assertEquals(ErrorCode.PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileMapper, never()).toUserProfileResponse(any());
    }

    @Test
    void testGetByEmail_WhenEmailExists_ReturnUserProfile() {
        String email = "example@gmail.com";
        when(userProfileRepository.findByEmail(email)).thenReturn(Optional.of(userProfile));
        when(userProfileMapper.toUserProfileResponse(userProfile)).thenReturn(userProfileResponse);

        UserProfileResponse result = userProfileService.getByEmail(email);

        assertNotNull(result);
        assertEquals("user-1", result.getId());
        assertEquals(email, result.getEmail());
        assertEquals("012345678", result.getPhoneNumber());
        verify(userProfileRepository).findByEmail(email);
        verify(userProfileMapper).toUserProfileResponse(userProfile);
    }

    @Test
    void testGetByEmail_WhenEmailNotExists_ThrowsAppException() {
        String email = "example@gmail.com";
        when(userProfileRepository.findByEmail(email)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userProfileService.getByEmail(email));

        assertEquals(ErrorCode.PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(userProfileRepository).findByEmail(email);
        verify(userProfileMapper, never()).toUserProfileResponse(any());
    }

    @Test
    void testDeleteByUserId_WhenUserIdExists_DeleteSuccessfully() {
        String userId = "USER_1";

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(userProfile));
        doNothing().when(userProfileRepository).delete(userProfile);

        userProfileService.deleteByUserId(userId);

        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileRepository).delete(userProfile);
    }

    @Test
    void testDeleteByUserId_WhenUserIdNotExists_ThrowsAppException() {
        String userId = "UN_KNOWN";

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> userProfileService.deleteByUserId(userId));

        assertEquals(ErrorCode.PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileRepository, never()).delete(any());
    }

    @Test
    void testUpdateByUserId_WhenUserIdExists_UpdateSuccessfully() {
        String userId = "USER_1";
        String updatedEmail = "updated@gmail.com";
        UserProfileUpdateRequest updateRequest = UserProfileUpdateRequest.builder()
                .email(updatedEmail)
                .build();

        UserProfileResponse updatedResponse = UserProfileResponse.builder()
                .id(userProfile.getId())
                .userId(userId)
                .email(updatedEmail)
                .phoneNumber(userProfile.getPhoneNumber())
                .build();

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(userProfile));
        doNothing().when(userProfileMapper).update(userProfile, updateRequest);
        when(userProfileRepository.save(userProfile)).thenReturn(userProfile);
        when(userProfileMapper.toUserProfileResponse(userProfile)).thenReturn(updatedResponse);

        UserProfileResponse result = userProfileService.updateByUserId(userId, updateRequest);

        assertNotNull(result);
        assertEquals(userId, result.getUserId());
        assertEquals(updatedEmail, result.getEmail());
        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileMapper).update(userProfile, updateRequest);
        verify(userProfileRepository).save(userProfile);
        verify(userProfileMapper).toUserProfileResponse(userProfile);
    }

    @Test
    void testUpdateByUserId_WhenUserIdNotExists_ThrowsAppException() {
        String userId = "USER_1";
        UserProfileUpdateRequest updateRequest = UserProfileUpdateRequest.builder()
                .email("updated@gmail.com")
                .build();

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class,
                () -> userProfileService.updateByUserId(userId, updateRequest));

        assertEquals(ErrorCode.PROFILE_NOT_FOUND, exception.getErrorCode());
        verify(userProfileRepository).findByUserId(userId);
        verify(userProfileMapper, never()).update(userProfile, updateRequest);
        verify(userProfileRepository, never()).save(any());
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {
            "   ",               // Chuỗi toàn khoảng trắng
            "invalid_format",    // Sai định dạng
            "email",             // Thiếu :asc hoặc :desc
            "email:random",      // Direction không phải asc/desc
            ":asc"               // Thiếu tên trường
    })
    void testGetProfiles_WhenEmptyOrInvalidSortBy_ReturnUnSorted(String invalidSortBy) {
        int pageNo = 0;
        int pageSize = 3;

        Page<UserProfile> emptyPage = new PageImpl<>(List.of());

        when(userProfileRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

        PagedResponse<List<UserProfileResponse>> result = userProfileService.getProfiles(pageNo, pageSize, invalidSortBy);

        ArgumentCaptor<Pageable> argumentCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(userProfileRepository).findAll(argumentCaptor.capture());
        Pageable capturedPageable = argumentCaptor.getValue();
        Sort sort = capturedPageable.getSort();

        assertTrue(sort.isUnsorted());
        assertNotNull(result);
        assertEquals(pageNo, result.getPageNo());
        assertEquals(pageSize, result.getPageSize());
        assertEquals(0, result.getTotalElements());
        assertTrue(result.getContent().isEmpty());
    }

    @Test
    void testGetProfiles_WhenValidSortBy_BuildCorrectSort() {
        int pageNo = 0;
        int pageSize = 3;
        String sortBy = "userId:asc";

        Page<UserProfile> emptyPage = new PageImpl<>(List.of());

        when(userProfileRepository.findAll(any(Pageable.class))).thenReturn(emptyPage);

        PagedResponse<List<UserProfileResponse>> result = userProfileService.getProfiles(pageNo, pageSize, sortBy);

        ArgumentCaptor<Pageable> argumentCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(userProfileRepository).findAll(argumentCaptor.capture());
        Pageable capturedPageable = argumentCaptor.getValue();
        Sort sort = capturedPageable.getSort();

        assertTrue(sort.isSorted());
        Sort.Order order = sort.getOrderFor("userId");
        assertNotNull(order);
        assertEquals(Sort.Direction.ASC, order.getDirection());
        assertNotNull(result);
    }

    @Test
    void testGetProfiles_WhenDataExists_ReturnCorrectPagedResponse() {
        int pageNo = 2; // page 2 trong request tương ứng index 1 trong Spring Data Pageable (Math.max(0, 2 - 1) = 1)
        int pageSize = 1;
        String sortBy = "email:DESC"; // Kiểm tra sort DESC và case-insensitive

        Page<UserProfile> pageResult = new PageImpl<>(List.of(userProfile), PageRequest.of(1, pageSize), 5);

        when(userProfileRepository.findAll(any(Pageable.class))).thenReturn(pageResult);
        when(userProfileMapper.toUserProfileResponse(userProfile)).thenReturn(userProfileResponse);

        PagedResponse<List<UserProfileResponse>> result = userProfileService.getProfiles(pageNo, pageSize, sortBy);

        // 1. Kiểm tra tham số truyền vào Repository
        ArgumentCaptor<Pageable> pageableCaptor = ArgumentCaptor.forClass(Pageable.class);
        verify(userProfileRepository).findAll(pageableCaptor.capture());
        Pageable capturedPageable = pageableCaptor.getValue();
        assertEquals(1, capturedPageable.getPageNumber());
        assertEquals(1, capturedPageable.getPageSize());

        Sort.Order order = capturedPageable.getSort().getOrderFor("email");
        assertNotNull(order);
        assertEquals(Sort.Direction.DESC, order.getDirection());

        // 2. Kiểm tra PagedResponse trả về
        assertNotNull(result);
        assertEquals(pageNo, result.getPageNo());
        assertEquals(pageSize, result.getPageSize());
        assertEquals(5, result.getTotalElements());
        assertEquals(5, result.getTotalPages());
        assertEquals(1, result.getContent().size());
        assertEquals(userProfileResponse.getEmail(), result.getContent().get(0).getEmail());

        verify(userProfileMapper).toUserProfileResponse(userProfile);
    }
}